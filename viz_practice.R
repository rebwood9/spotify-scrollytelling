
# Pakcages ----
library(tidyverse)

# Data ----
yearly_summary <- read_csv("data/processed/yearly_summary.csv")
monthly_summary <- read_csv("data/processed/monthly_summary.csv")
daily_summary <- read_csv("data/processed/daily_summary.csv")

# Graphs ---- 
## Year ----
### Total number of songs per year ----
ggplot(yearly_summary, aes(x = year)) +
  geom_col(aes(y = total_songs), fill = "#1DB954", alpha = 0.8) +
  geom_point(aes(y = unique_songs), color = "black", size = 2.5) +
  geom_line(aes(y = unique_songs, group = 1), color = "black", linewidth = 0.5) +
  scale_x_continuous(breaks = sort(unique(yearly_summary$year))) +
  scale_y_continuous(n.breaks = 10) +
  labs(
    title = "Total Songs vs. Unique Songs by Year",
    x = "Year",
    y = "Number of Songs"
  ) +
  theme_minimal() + 
  theme(
    panel.grid.minor = element_blank()
  )

### Total number of minutes played by year
ggplot(yearly_summary, aes(x = year)) +
  geom_col(aes(y = total_minutes), fill = "#1DB954", alpha = 0.8) +
  scale_x_continuous(breaks = sort(unique(yearly_summary$year))) +
  scale_y_continuous(n.breaks = 10) +
  labs(
    x = "Year",
    y = "Total Minutes Played",
    title = "Total Minutes Played by Year"
  ) +
  theme_minimal() + 
  theme(
    panel.grid.minor = element_blank()
  )

### Total number of unique artists played by year
ggplot(yearly_summary, aes(x = year)) +
  geom_col(aes(y = unique_artists), fill = "#1DB954", alpha = 0.8) +
  scale_x_continuous(breaks = sort(unique(yearly_summary$year))) +
  scale_y_continuous(n.breaks = 10) +
  labs(
    x = "Year",
    y = "Total Unique Artists",
    title = "Total Unique Artists by Year"
  ) +
  theme_minimal() + 
  theme(
    panel.grid.minor = element_blank()
  )

### Total number of unique genres played by year
ggplot(yearly_summary, aes(x = year)) +
  geom_col(aes(y = unique_genre), fill = "#1DB954", alpha = 0.8) +
  scale_x_continuous(breaks = sort(unique(yearly_summary$year))) +
  scale_y_continuous(n.breaks = 10) +
  labs(
    x = "Year",
    y = "Total Unique Genres",
    title = "Total Unique Genres by Year"
  ) +
  theme_minimal() + 
  theme(
    panel.grid.minor = element_blank()
  )

## Random ----

