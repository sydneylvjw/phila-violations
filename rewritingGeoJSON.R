# Setup----
## Loading in packages----
library(pacman)

install.packages("data.table")
install.packages("dtplyr")
install.packages("stringi")
install.packages("cleaner")

library(pacman)
p_load(data.table, dtplyr, ggplot2, lubridate, stringi, cleaner, sf, tidyverse, tidycensus, dplyr)

## Reading in layers----
rawImm <- st_read("/Users/sydneyjones/GitHub/phila-violations/data/immDang.geojson")

rawUnsafe <- st_read("/Users/sydneyjones/GitHub/phila-violations/data/unsafe.geojson")

hoods <- st_read("/Users/sydneyjones/GitHub/phila-violations/data/philaHoods.geojson")

viols <- st_read("/Users/sydneyjones/OneDrive - PennO365/MCP-MUSA/01. Fall 2025/00. Thesis/Violations/data/violations_codedRAW.shp")

# hoods_viols: joining violations to neighborhoods to aggregate----

## Converting to SF----
geoImm <- rawImm %>% 
  st_as_sf(
    coords = c("geocode_x", "geocode_y"), 
    crs = 4326
  )

geoUnsafe <- rawUnsafe %>% 
  st_as_sf(
    coords = c("geocode_x", "geocode_y"), 
    crs = 4326
  )

hoods_sf <- hoods %>% 
  st_as_sf(
    coords = c("geocode_x", "geocode_y"), 
    crs = 4326
  ) %>% 
  st_make_valid()



## checking spatial attributes----
st_is_valid(hoods_sf)
st_is_valid(viols)
st_crs(hoods_sf)
st_crs(viols)



## hoods_viols: joining neighborhoods and violations
hoods_viols <- hoods_validsf %>% 
  st_join(viols, 
          join = st_intersects, 
          left = T
          )

# hoods_viols: summarizing----

# Ok, processing time is too long. Going to install and run two new packages: data.table and dtplyr. These should help for processing large tables. 

## lazy_dt(): working with dtplyr----

# apparently all that needs to be done to use this package is to call lazy_dt() into the pipe at the beginning, and then convert the output as a tibble.

### *case_priorities*: priority given to case associated with the violations----
case_priority <- hoods_viols %>% 
  lazy_dt() %>% 
  group_by(NAME, year = cscrt_y, csprrty) %>% 
  tally() %>% 
  arrange(NAME, year) %>% 
  as_tibble()


#### *case_type*: sorted by case type----
case_type <- hoods_viols %>% 
  group_by(NAME, year = cscrt_y, casetyp) %>% 
  tally() %>% 
  arrange(NAME, year) %>% 
  as_tibble()



#### *case_responsibility*: departmental responsibility of violation----
case_responsibility <- hoods_viols %>% 
  lazy_dt() %>% 
  group_by(NAME, year = cscrt_y, csrspns) %>%
  tally() %>% 
  arrange(NAME, year) %>% 
  as_tibble()
 


#### *case_status*: summarizing the case statuses per year----
case_status <- hoods_viols %>% 
  lazy_dt() %>% 
  group_by(NAME, year = cscrt_y, casstts) %>% 
  tally() %>% 
  arrange(NAME, year) %>% 
  as_tibble()



#### *viol_status*: summarizing the number of violation statuses per year----
viol_status <- hoods_viols %>% 
  lazy_dt() %>% 
  group_by(NAME, year = cscrt_y, vltnstt) %>% 
  tally() %>% 
  arrange(NAME, year) %>% 
  as_tibble()



#### *viol_resolutionCode*: summarizing the number of violation resolution codes by year----
viol_resolutionCode <- hoods_viols %>% 
  lazy_dt() %>% 
  group_by(NAME, year = cscrt_y, vltnrsl) %>% 
  tally() %>% 
  arrange(NAME, year) %>% 
  as_tibble()



#### *viol_perAddress*: summarizing the addresses with the highest number of violations per year----
viol_perAddress <- hoods_viols %>% 
  lazy_dt() %>% 
  group_by(NAME, address, year = vltn_yr) %>% 
  tally() %>% 
  arrange(desc(n)) %>% 
  as_tibble()



#### *viol_addressYear*: trying to filter the addresses down to top 50 per year----
viol_addressYear <- viol_perAddress %>% 
  arrange(NAME, year, desc(n)) %>% 
  group_by(year) %>% 
  slice_head(n = 50) %>% 
  group_by(address) %>% 
  mutate(address_Count = n()) %>% 
  ungroup()


#### *viol_typeYear*: summarizing the count of violation type per year----
viol_typeYear <- hoods_viols %>% 
  lazy_dt() %>% 
  group_by(NAME, year = vltn_yr, vltncdt) %>% 
  tally() %>%
  arrange(NAME, year) %>% 
  as_tibble()



# Spatializing output----

## extract geoms from hoods_sf----
hoodGeom <- hoods_sf %>% 
  select(NAME, geometry)



## joining geoms back to outputs----
casePrioritySf <- hoodGeom %>% 
  right_join(case_priority, "NAME") 

caseResponsibilitySf <- hoodGeom %>% 
  right_join(case_responsibility, "NAME")

caseStatus <- hoodGeom %>% 
  right_join(case_status, "NAME")

caseType <- hoodGeom %>% 
  right_join(case_type, "NAME")

violAddressYear <- hoodGeom %>% 
  right_join(viol_addressYear, "NAME")

violResolutionCode <- hoodGeom %>% 
  right_join(viol_resolutionCode, "NAME")

violStatus <- hoodGeom %>% 
  right_join(viol_status, "NAME")

violTypeYear <- hoodGeom %>% 
  right_join(viol_typeYear, "NAME")

# Writing out raw csvs----
write_csv(case_type, "/Users/sydneyjones/GitHub/phila-violations/data/caseType.csv")
write_csv(case_priority, "/Users/sydneyjones/GitHub/phila-violations/data/casePriority.csv")
write_csv(case_responsibility, "/Users/sydneyjones/GitHub/phila-violations/data/caseResponsibility.csv")
write_csv(case_status, "/Users/sydneyjones/GitHub/phila-violations/data/caseStatus.csv")
write_csv(case_type, "/Users/sydneyjones/GitHub/phila-violations/data/caseType.csv")
write_csv(viol_addressYear, "/Users/sydneyjones/GitHub/phila-violations/data/violAddress.csv")
write_csv(viol_resolutionCode, "/Users/sydneyjones/GitHub/phila-violations/data/violResolution.csv")
write_csv(viol_status, "/Users/sydneyjones/GitHub/phila-violations/data/violStatus.csv")
write_csv(viol_typeYear, "/Users/sydneyjones/GitHub/phila-violations/data/violType.csv")

# Writing out geojson----
st_write(casePrioritySf, "/Users/sydneyjones/GitHub/phila-violations/data/casePriority.geojson", driver = "geoJSON", delete_dsn = TRUE)


st_write(caseResponsibilitySf, "/Users/sydneyjones/GitHub/phila-violations/data/caseResponsibility.geojson", driver = "geoJSON", delete_dsn = TRUE)

st_write(caseStatus, "/Users/sydneyjones/GitHub/phila-violations/data/caseStatus.geojson", driver = "geoJSON", delete_dsn = TRUE)

st_write(caseType, "/Users/sydneyjones/GitHub/phila-violations/data/caseType.geojson", driver = "geoJSON", delete_dsn = TRUE)

st_write(violAddressYear, "/Users/sydneyjones/GitHub/phila-violations/data/violAddressYear.geojson", driver = "geoJSON", delete_dsn = TRUE)

st_write(violResolutionCode, "/Users/sydneyjones/GitHub/phila-violations/data/violResolutionCode.geojson", driver = "geoJSON", delete_dsn = TRUE)

st_write(violStatus, "/Users/sydneyjones/GitHub/phila-violations/data/violStatus.geojson", driver = "geoJSON", delete_dsn = TRUE)

st_write(violTypeYear, "/Users/sydneyjones/GitHub/phila-violations/data/violTypeYear.geojson", driver = "geoJSON", delete_dsn = TRUE)

st_write(geoImm, "/Users/sydneyjones/GitHub/phila-violations/data/immDang.geojson", driver = "geoJSON", delete_dsn = TRUE)

st_write(geoUnsafe, "/Users/sydneyjones/GitHub/phila-violations/data/unsafe.geojson", driver = "geoJSON", delete_dsn = TRUE)

st_write(violPerAddress_sf, "/Users/sydneyjones/GitHub/phila-violations/data/violPerAddress.geojson", driver = "geoJSON", delete_dsn = TRUE)

