# Decision log

Your methods section. About one page total.

Answer these as you go, not the night before it is due.
Specifics beat polish - a short honest answer is worth more than a long vague one.

Delete these instructions when you are done, or leave them. It does not matter.

---

## 1. What did you set out to build, and what changed?

What you wanted at the start, and what is actually live now.
Name one thing you dropped or added along the way, and why.

The main thing that I wanted to build from the start was a personal portfolio, CV, and resume website for potential recruiters, or just for people who want to get to know me. This site would be linked on my actual resume itself when I give it to recruiters, or be given during applications for jobs. What is live right now at https://sang-bui.github.io/ is pretty much what I originally wanted, and I am genuinely proud of it.

One thing that changed along the way was that I decided to add a section called "Beyond the Resume." Originally, I was mostly focused on showing my research, work experience, and technical skills. However, I realized that if this was going to be my personal website, I wanted people to get to know me outside of just my professional background too. I ended up adding my Spotify stats, a travel map, and a list of concerts that I have attended. I think this makes the website feel more personal, and gives people a better idea of who I am outside of just what I have done professionally.


---

## 2. A fork in the road

Name one real choice where you could have gone two ways.
Plain HTML or a framework. One page or several. Your own CSS or someone's template.
What goes on the front page and what does not.

Say which you picked, what the alternative was, and what you gave up by not taking it.

"There was no alternative" is not an answer. Find the fork.

One choice that I had to make was how I wanted to organize the website itself. Originally, I had everything in a more traditional layout where you would just scroll down through the different sections. I also tried adding some statistics and visualizations on the right side of each section, but I was not really happy with how it looked. The other option was to have a fixed sidebar on the left, where my name, navigation, and career trajectory would stay visible while people scroll through my work on the right.

I ended up going with the fixed sidebar after looking at other personal websites for inspiration, particularly brittanychiang.com. I really liked how the sidebar kept the important information in one place rather than having everything disappear as you scroll. The trade-off was that I had to remove the individual statistics cards that I had already built for each section, and I also had less space for the actual content on the right. However, I think the fixed sidebar made the website feel more organized overall, and it also gave me a place to put my interactive 3D career trajectory without having it take up an entire section of the website.

---

## 3. Where you overruled the agent

One time Claude suggested, wrote, or claimed something and you did not take it.

What did it do? How did you notice? What did you do instead?

If it genuinely never happened, say so plainly, and then say what you would have had to
check in order to notice. Being honest here costs you far less than a story you cannot
defend when you record your video.

One time that I overruled Claude was when I asked it to explore some design ideas inspired by topographic maps, SLAM occupancy grids, and point clouds, since those are things that relate to my research. Claude ended up adding a bunch of different textures and visualizations throughout the website, including contour lines and new section icons. However, when I actually looked at the website, I thought it looked very ugly. I think the main issue was that there was just too much going on visually, and the different textures did not really work together the way I had imagined.

Instead of trying to fix each individual element, I decided to scrap that entire direction and go back to the previous version of the website. I told Claude to remove those changes and keep the point cloud as the main visual element instead. I think this was a good example of why I could not just trust Claude's design decisions without actually looking at the result myself. Even though the changes technically worked, they were not what I wanted for my website.

---

## 4. How you know it works

What check did you run, and what did it tell you?

Then the real question: **what would have made this check fail?**
A check that could not have failed is not a check.

Link to your `verification/` folder.

To verify that my website was actually working, I ran `curl -sI https://sang-bui.github.io/` in my terminal and checked the live website in Chrome. The curl command returned an HTTP 200 response, which told me that GitHub Pages was successfully serving my website. I also opened the actual URL in my browser and took a screenshot to make sure that the website was displaying correctly, rather than just trusting that Claude had deployed it successfully.

The check would have failed if the website returned a 404 error, or if I opened it in Chrome and saw a blank page, missing styling, or content that did not match what I had built. I think checking both the response from GitHub Pages and the actual website was important, since getting a successful response does not necessarily mean that everything on the website is displaying correctly.

Verification folder: https://github.com/sang-bui/sang-bui.github.io/tree/main/verification

---

## 5. What is still wrong

One thing on your own site that is not right, not finished, or that you do not
fully understand.

What would you do next, and how would you find out?

One thing that I think is still not fully finished on my website is the data science section, particularly the interactive PDSI explorer that I added from my research at NCAR. Right now, it only shows a small portion of the actual data that I worked with, and there are still some other visualizations from my research that I could add, such as the CAFEC calibration-coefficient charts. I think the current version works well, but it does not really show the full extent of the research that I did.

If I were to continue working on it, I would probably go back through my original research notebooks and figure out which other visualizations would actually be useful to include. I would also want to make sure that the data being displayed matches my original results, rather than just trusting that Claude extracted everything correctly. After adding them, I would check the actual live website to make sure everything works as expected, since I have learned that something working locally does not necessarily mean it will work once it is deployed.