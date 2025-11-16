library(pacman)
p_load(dplyr, tidyverse, sf)

rawImm <- st_read("/Users/sydneyjones/GitHub/phila-violations/data/immDang.geojson")

rawUnsafe <- st_read("/Users/sydneyjones/GitHub/phila-violations/data/unsafe.geojson")

geoImm <- rawImm %>% 
  st_as_sf(coords = c("geocode_x", "geocode_y"), crs = 4327)
geoUnsafe <- rawUnsafe %>% 
  st_as_sf(coords = c("geocode_x", "geocode_y"), crs = 4327)

st_write(geoImm, "/Users/sydneyjones/GitHub/phila-violations/data/immDang.geojson", driver = "geoJSON", delete_dsn = TRUE)

st_write(geoUnsafe, "/Users/sydneyjones/GitHub/phila-violations/data/unsafe.geojson", driver = "geoJSON", delete_dsn = TRUE)