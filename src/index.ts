import "source-map-support/register";
import { ServiceManager } from "@foal/core";

// std
import * as http from "http";

// 3p
import { Config, createApp, displayServerURL } from "@foal/core";

// App
import { AppController } from "./app/app.controller";
import { AppBusiness } from "./app/app.business";

async function main() {
  // const app = await createApp(AppController);

  // const httpServer = http.createServer(app);
  // const port = Config.get('port', 'number', 3001);
  // httpServer.listen(port, () => displayServerURL(port));
  const serviceManager = new ServiceManager();
  const appBusiness = serviceManager.get(AppBusiness);
  return appBusiness.init();
}

main().catch((err) => {
  console.error(err.stack);
  process.exit(1);
});
