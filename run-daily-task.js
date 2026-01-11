var axios = require('axios');
let lastRun = null; // track last execution time

async function dailyJob(client, fs) {
  console.log("Daily task started:", new Date().toISOString());

  return new Promise(async (resolve, reject) => {
    let currHour = new Date().getHours();
    console.log('--currHour--', currHour);
    if (currHour != 4) {
      console.log('--currHour == 23--', currHour);
      resolve();
    } else {
        const title = 'Vote for your meal 🥗 today';
        const description = 'Vote now!';
        const segmentId =  '52552';
        console.log('--Push Title--', title);
        console.log('--Push Description--', description);
        axios
        .post('https://api.pushalert.co/rest/v1/segment/'+segmentId+'/send', 'url=https://www.slimcrust.com/cafe/zolo&title='+title+'&message='+description, {headers: {'Authorization': 'api_key=2012aa1c7e1cc3a1905f98fd47a7dcf7'}})
        .then(res => {
          console.log('Pushalert success: ');
        })
        .catch(error => {
          console.log('Pushalert error: ', error);
        });    
    }

  }).then(() => {
    console.log("Weekly task finished:", new Date().toISOString());
  });
}

function runDailyTaskRoute(app, client, fs, taskKey) {
  app.post("/run-daily-task", async (req, res) => {
    try {
      /*const SECRET_KEY = taskKey;
      if (req.query.key !== SECRET_KEY) {
        return res.status(403).json({ error: "Forbidden" });
      }*/

      const now = Date.now();
      if (lastRun && now - lastRun < 60 * 1000) {
        return res.status(429).json({ message: "Task already ran recently" });
      }
      lastRun = now;

      await dailyJob(client, fs);
      res.json({ status: "ok", ranAt: new Date().toISOString() });
    } catch (err) {
      console.error("Weekly task failed:", err);
      res.status(500).json({ error: "Task execution failed" });
    }
  });
}

module.exports = runDailyTaskRoute;
