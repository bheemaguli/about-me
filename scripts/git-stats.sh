#!/bin/bash

# Configuration
EMAIL="sumanth"
OUTPUT_FILE="./git_personal_stats_$(date +%Y%m%d).json"
REPO_PATH="."

# Set fixed start date to October 2022
START_DATE="2022-10-01"
END_DATE=$(date +"%Y-%m-%d")

# Change to repository directory
cd $REPO_PATH || { echo "Repository path not found"; exit 1; }

# Make sure we have the latest data
git fetch --all > /dev/null 2>&1

# Start JSON output
echo "{" > $OUTPUT_FILE
echo "  \"generated_at\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\"," >> $OUTPUT_FILE
echo "  \"date_range\": {" >> $OUTPUT_FILE
echo "    \"start_date\": \"$START_DATE\"," >> $OUTPUT_FILE
echo "    \"end_date\": \"$END_DATE\"" >> $OUTPUT_FILE
echo "  }," >> $OUTPUT_FILE

# Total stats (from START_DATE)
TOTAL_COMMITS=$(git log --author="$EMAIL" --since="$START_DATE" --oneline | wc -l)
TOTAL_PRS=$(git log --author="$EMAIL" --merges --since="$START_DATE" --oneline | wc -l)
TOTAL_FILES_CHANGED=$(git log --author="$EMAIL" --since="$START_DATE" --name-only --pretty=format: | sort -u | wc -l)

echo "  \"lifetime_stats\": {" >> $OUTPUT_FILE
echo "    \"total_commits\": $TOTAL_COMMITS," >> $OUTPUT_FILE
echo "    \"total_prs\": $TOTAL_PRS," >> $OUTPUT_FILE
echo "    \"files_changed\": $TOTAL_FILES_CHANGED" >> $OUTPUT_FILE
echo "  }," >> $OUTPUT_FILE

# Code contribution stats (from START_DATE)
LINES_ADDED=$(git log --author="$EMAIL" --since="$START_DATE" --numstat --pretty="%H" | awk 'NF==3 {plus+=$1} END {print plus}')
LINES_DELETED=$(git log --author="$EMAIL" --since="$START_DATE" --numstat --pretty="%H" | awk 'NF==3 {minus+=$2} END {print minus}')

echo "  \"code_contribution\": {" >> $OUTPUT_FILE
echo "    \"lines_added\": $LINES_ADDED," >> $OUTPUT_FILE
echo "    \"lines_deleted\": $LINES_DELETED" >> $OUTPUT_FILE
echo "  }," >> $OUTPUT_FILE

# Daily contribution data (for GitHub-like contribution graph)
echo "  \"contribution_calendar\": {" >> $OUTPUT_FILE

# Generate daily commit counts
echo "    \"daily_commits\": {" >> $OUTPUT_FILE
FIRST_DAY=true

# Loop through each day from START_DATE to END_DATE
current_date="$START_DATE"
while [[ "$current_date" < "$END_DATE" ]] || [[ "$current_date" == "$END_DATE" ]]; do
  next_date=$(date -d "$current_date + 1 day" +"%Y-%m-%d")

  # Count commits for this day
  DAY_COMMITS=$(git log --author="$EMAIL" --since="$current_date 00:00:00" --until="$next_date 00:00:00" --oneline | wc -l)

  if [ "$FIRST_DAY" = true ]; then
    FIRST_DAY=false
  else
    echo "," >> $OUTPUT_FILE
  fi
  echo "      \"$current_date\": $DAY_COMMITS" >> $OUTPUT_FILE

  # Move to next day
  current_date="$next_date"
done

echo "    }" >> $OUTPUT_FILE
echo "  }," >> $OUTPUT_FILE

# Monthly activity
echo "  \"monthly_activity\": {" >> $OUTPUT_FILE

# Get months from July 2022 to now
current_year=$(date +%Y)
current_month=$(date +%-m)
months_since_start=$(( (current_year - 2022) * 12 + current_month - 7 ))

echo "    \"commits\": {" >> $OUTPUT_FILE
MONTHS=$(seq 0 $months_since_start | xargs -I{} date -d "$START_DATE +{} months" +"%Y-%m" | sort)
FIRST_MONTH=true

for month in $MONTHS; do
  NEXT_MONTH=$(date -d "$month-01 next month" +"%Y-%m")
  MONTH_COMMITS=$(git log --author="$EMAIL" --since="$month-01" --until="$NEXT_MONTH-01" --oneline | wc -l)

  if [ "$FIRST_MONTH" = true ]; then
    FIRST_MONTH=false
  else
    echo "," >> $OUTPUT_FILE
  fi
  echo "      \"$month\": $MONTH_COMMITS" >> $OUTPUT_FILE
done
echo "    }," >> $OUTPUT_FILE

# Monthly PRs
echo "    \"pull_requests\": {" >> $OUTPUT_FILE
FIRST_MONTH=true

for month in $MONTHS; do
  NEXT_MONTH=$(date -d "$month-01 next month" +"%Y-%m")
  MONTH_PRS=$(git log --author="$EMAIL" --merges --since="$month-01" --until="$NEXT_MONTH-01" --oneline | wc -l)

  if [ "$FIRST_MONTH" = true ]; then
    FIRST_MONTH=false
  else
    echo "," >> $OUTPUT_FILE
  fi
  echo "      \"$month\": $MONTH_PRS" >> $OUTPUT_FILE
done
echo "    }," >> $OUTPUT_FILE

# Monthly code changes
echo "    \"code_changes\": {" >> $OUTPUT_FILE
FIRST_MONTH=true

for month in $MONTHS; do
  NEXT_MONTH=$(date -d "$month-01 next month" +"%Y-%m")

  # Get lines added/removed for this month
  MONTH_ADDED=$(git log --author="$EMAIL" --numstat --pretty="%H" --since="$month-01" --until="$NEXT_MONTH-01" | awk 'NF==3 {plus+=$1} END {print plus}')
  MONTH_DELETED=$(git log --author="$EMAIL" --numstat --pretty="%H" --since="$month-01" --until="$NEXT_MONTH-01" | awk 'NF==3 {minus+=$2} END {print minus}')

  if [ "$FIRST_MONTH" = true ]; then
    FIRST_MONTH=false
  else
    echo "," >> $OUTPUT_FILE
  fi
  echo "      \"$month\": {" >> $OUTPUT_FILE
  echo "        \"added\": $MONTH_ADDED," >> $OUTPUT_FILE
  echo "        \"deleted\": $MONTH_DELETED" >> $OUTPUT_FILE
  echo "      }" >> $OUTPUT_FILE
done
echo "    }" >> $OUTPUT_FILE
echo "  }," >> $OUTPUT_FILE

# Activity by day of week
echo "  \"weekday_activity\": {" >> $OUTPUT_FILE
declare -A WEEKDAYS=( ["1"]="Monday" ["2"]="Tuesday" ["3"]="Wednesday" ["4"]="Thursday" ["5"]="Friday" ["6"]="Saturday" ["7"]="Sunday" )

# Initialize counts
for day in "${WEEKDAYS[@]}"; do
    declare "count_$day=0"
done

# Count commits per weekday using author date
while IFS= read -r commit_date; do
    if [ ! -z "$commit_date" ]; then
        # Get day of week (1-7, where 1 is Monday)
        day_num=$(date -d "$commit_date" +%u)
        day_name="${WEEKDAYS[$day_num]}"
        declare "count_$day_name=$((count_$day_name + 1))"
    fi
done < <(git log --author="$EMAIL" --since="$START_DATE" --format="%aI" --date=iso-strict)

# Output the counts
first=true
for day in Monday Tuesday Wednesday Thursday Friday Saturday Sunday; do
    if [ "$first" = true ]; then
        echo "    \"$day\": $(eval echo \$count_$day)" >> $OUTPUT_FILE
        first=false
    else
        echo "    ,\"$day\": $(eval echo \$count_$day)" >> $OUTPUT_FILE
    fi
done
echo "  }," >> $OUTPUT_FILE

# Activity by hour of day
echo "  \"hourly_activity\": {" >> $OUTPUT_FILE
for i in {0..23}; do
  HOUR_COMMITS=$(git log --author="$EMAIL" --since="$START_DATE" --date=format:"%H" --pretty=format:"%ad" | grep "^$(printf "%02d" $i)$" | wc -l)

  if [ $i -eq 0 ]; then
    echo "    \"$i\": $HOUR_COMMITS" >> $OUTPUT_FILE
  else
    echo "    ,\"$i\": $HOUR_COMMITS" >> $OUTPUT_FILE
  fi
done
echo "  }" >> $OUTPUT_FILE

# Close JSON
echo "}" >> $OUTPUT_FILE

echo "Personal stats for $EMAIL have been written to $OUTPUT_FILE"
