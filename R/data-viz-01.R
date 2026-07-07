# Data visualization start 

# Packages ----
library(jsonlite)
library(tidyverse)


# Data ----
df <- read_csv("data/raw/combined_output.csv")

# Isolate music data ----
music_df <- df |>
  filter(if_any(
    c(
      master_metadata_track_name,
      master_metadata_album_album_name,
      master_metadata_album_artist_name
    ),
    ~ !is.na(.x)
  )) |> 
  select(
    platform, ms_played, conn_country, track_id,
    master_metadata_track_name,
    master_metadata_album_album_name,
    master_metadata_album_artist_name,
    reason_start, reason_end,
    shuffle, skipped,
    year,  month, day, time, minutes_played
  )

# Summary Tables ----
## Year ---- 
yearly_summary <- music_df |> 
  summarise(
    total_songs = n(),
    total_minutes = sum(minutes_played),
    unique_songs = n_distinct(master_metadata_track_name), 
    unique_artists = n_distinct(master_metadata_album_artist_name), 
    .by = year
  )

## Month ---- 
monthly_summary <- music_df |> 
  summarise(
    total_songs = n(),
    total_minutes = sum(minutes_played),
    unique_songs = n_distinct(master_metadata_track_name), 
    unique_artists = n_distinct(master_metadata_album_artist_name), 
    .by = c(year, month)
  )

# Graphs ---- 
## Total number of songs per year ----
ggplot(yearly_summary, aes(x = year)) +
  geom_col(aes(y = total_songs), fill = "#1DB954", alpha = 0.8) +
  geom_point(aes(y = unique_songs), color = "black", size = 2.5) +
  geom_line(aes(y = unique_songs, group = 1), color = "black", linewidth = 0.5) +
  labs(
    title = "Total Songs vs. Unique Songs by Year",
    x = "Year",
    y = "Number of Songs"
  ) +
  theme_minimal()

## Total number of minutes played by year
ggplot(yearly_summary, aes(x = year, y = total_minutes)) +
  geom_col(aes(y = total_minutes), fill = "#1DB954", alpha = 0.8) +
  labs(
    x = "Year",
    y = "Total Minutes Played",
    title = "Total Minutes Played by Year"
  ) +
  theme_minimal()

## Total number of unique artists played by year
ggplot(yearly_summary, aes(x = year, y = unique_artists)) +
  geom_col(aes(y = unique_artists), fill = "#1DB954", alpha = 0.8) +
  labs(
    x = "Year",
    y = "Total Unique Artists",
    title = "Total Unique Artists by Year"
  ) +
  theme_minimal()

## Total by year and month 
ggplot(monthly_summary, aes(x = year, y = total_minutes)) +
  geom_col(aes(y = total_minutes), fill = "#1DB954", alpha = 0.8) +
  labs(
    x = "Year",
    y = "Total Minutes Played",
    title = "Total Minutes Played by Year"
  ) +
  theme_minimal()

