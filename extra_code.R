# Summarizing by year
summarise(count07 = n_distinct(vltn_yr == "2007"),
count08 = n_distinct(vltn_yr == "2008"),
count09 = n_distinct(vltn_yr == "2009"),
count10 = n_distinct(vltn_yr == "2010"),
count11 = n_distinct(vltn_yr == "2011"),
count12 = n_distinct(vltn_yr == "2012"),
count13 = n_distinct(vltn_yr == "2013"),
count14 = n_distinct(vltn_yr == "2014"),
count15 = n_distinct(vltn_yr == "2015"),
count16 = n_distinct(vltn_yr == "2016"),
count17 = n_distinct(vltn_yr == "2017"),
count18 = n_distinct(vltn_yr == "2018"),
count19 = n_distinct(vltn_yr == "2019"),
count20 = n_distinct(vltn_yr == "2020"),
count21 = n_distinct(vltn_yr == "2021"),
count22 = n_distinct(vltn_yr == "2022"),
count23 = n_distinct(vltn_yr == "2023"),
count24 = n_distinct(vltn_yr == "2024"))


summarise(tot_cases = n_distinct(casnmbr),
          tot_casePriorityUnsafe = n_distinct(csprrty == "UNSAFE"),
          tot_casePriorityStandard = n_distinct(csprrty == "STANDARD"),
          tot_casePriorityConstructionServices = n_distinct(csprrty == "CONSTRUCTION SERVICES"),
          tot_casePriorityHazardous = n_distinct(csprrty == "HAZARDOUS"),
          tot_casePriorityImmDang = n_distinct(csprrty == "IMMINENTLY DANGEROUS"),
          caseType_noticeOfViol = n_distinct(casetyp == "NOTICE OF VIOLATION")) %>% 
  arrange(NAME, desc(year)) %>% 
  as_tibble()


caseType_CVN = n_distinct(casetyp == "CODE VIOLATION NOTICE"),
caseType_SVN = n_distinct(casetyp == "SITE VIOLATION NOTICE"),
caseType_vendingConfiscation = n_distinct(casetyp == "VENDING CONFISCATION"),
caseType_warning = n_distinct(casetyp == "WARNING"),
caseType_NA = n_distinct(is.na(casetyp)),
caseStatus_cancelled = n_distinct(casstts == "CANCELLED"),
caseStatus_closed = n_distinct(casstts == "CLOSED"),
caseStatus_balanceDue  = n_distinct(casstts == "COMPLIED, BALANCE DUE"),
caseStatus_inViolation  = n_distinct(casstts == "IN VIOLATION"),
caseStatus_inViolationCourt  = n_distinct(casstts == "IN VIOLATION - COURT"),
caseStatus_stopWork  = n_distinct(casstts == "STOP WORK"),
caseStatus_svnBalanceDue  = n_distinct(casstts == "SVN ISSUED, BALANCE DUE"),
caseStatus_underInvest  = n_distinct(casstts == "UNDER INVESTIGATION")) %>% 
  arrange(NAME, desc(year)) %>% 
  as_tibble()


tot_viols = n_distinct(vltnnmb),
violStatus_closed = n_distinct(vltnstt == "CLOSED"),
violStatus_closedCase = n_distinct(vltnstt == "CLOSEDCASE"),
violStatus_complied = n_distinct(. %in% c("COMPLIED", "CMPLY")),
violStatus_compexCP = n_distinct(vltnstt == "COMPEXCP"),
violStatus_cvnIssued = n_distinct(vltnstt == "CVN ISSUED"),
violStatus_demo = n_distinct(vltnstt == "DEMOLISH"),
violStatus_error = n_distinct(vltnstt == "ERROR"),
violStatus_open = n_distinct(vltnstt == "OPEN"),
violStatus_resolved = n_distinct(vltnstt == "RESOLVE"),
violStatus_stopWork = n_distinct(vltnstt == "STOP WORK"),
violStatus_svnIssued = n_distinct(vltnstt == "SVN ISSUED"),
violStatus_warningIssued = n_distinct(vltnstt == "WARNING ISSUED"),
violStatus_NA = n_distinct(is.na(vltnstt))
) %>% 
  arrange(NAME, desc(year)) %>% 
  as_tibble()






#### *viol_perAddressStatus*: now by violation case status per address per year----
viol_perAddressStatus <- hoods_viols %>% 
  lazy_dt() %>% 
  group_by(address, vltnstt, vltn_yr) %>% 
  summarise(count = n()) %>% 
  arrange(desc(count)) %>% 
  as_tibble()


#### *viol_addressStatusYear*: trying to filter the addresses down to top 50 per case status and year----
viol_addressStatusYear <- viol_perAddressStatus %>% 
  arrange(vltn_yr, vltnstt, desc(count)) %>% 
  group_by(vltn_yr) %>% 
  slice_head(n = 50)
