# MKT Portal

Currency Fair Achitecture Task

## Intro

Message Report - Data Analyses Portal. Displays information related to messages ingested and processed. Displays realtime information related to Workers processing state - Messages processed, Messages failed and Messages retrying. It displays also information related to the most common currency trade. It would be possible to display other information related to e.g. Redis status by adding new functionality to the BeeQueue implementation.

The portal is accessbile through http and is "protected" with basic (hardcoded) authentication.

**Basic Authentication:**<br/>
username: admin<br/>
password: admin

## URL

### http://mkt-server.cloudapp.net:3000/mkt/portal

# Run

Windows:
```bash
set MKT_CONFIG_FILE=\path\to\config.json&&node mkt-portal/index.js
```

Linux:
```bash
export MKT_CONFIG_FILE="/path/to/config.json";node mkt-portal/index.js
```

## Configurations

The configurations file is shared among all the projects and is located here: [config.json](https://github.com/mcmartins/mkt-portal/blob/master/config.json)
