# Forex Data Yahoo Scraper

### This is the assignment for Vance.tech

The app is divided into client and server both written in Typescript.

- Client : Vite app with Tailwind and Shadcn deployed on vercel
- Server: Node Express app with mutiple endpoints deployed on a personal EC2 instance

URLs:

- Client : [http://forex-api-frontend.aryn.wtf/](http://forex-api-frontend.aryn.wtf/)
- Server : [http://forex-api.aryn.wtf/](http://forex-api.aryn.wtf/)
- SwaggerDocs: [http://forex-api.aryn.wtf/api-docs](http://forex-api.aryn.wtf/api-docs)

Description:

- The server uses a yahoo endpoint found in the browser requests to extract data from the yahoo finance servers.
  Alternatively, a puppeteer based approach is also provided to scrape the pages.
- The data is stord on sqlite db and returned when requeted. If no data is present, a scraping is done to get data
- The client displays all the information stored: Close, Open, High, Low, AdjClose and can request data of various intervals.
- The SwaggerDocs can be used to test out endpoints.
- The scrape-cron.ts script can be used to build a cron that periodically scrapes data. A sample [scrape-cron.sh](scrape-cron.sh) file is also present in this application which can be used
