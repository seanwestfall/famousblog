## For a Few Monads More
Got passed on another job I suspect (I didn't actually get the word, but I get the feeling like it was a pass just based on some skimmy evidence). It was for a medical device test engineering job in a region far from where I live that I really didn't have any intention of seriously accepting. The reason, though I don't really know, was probably because I only spent two hours on the take home assignment I was given -- since the interview was arranged so suddenly, I really didn't have enough time to work on it. I'm only a little bit bummed, rejection always feels that way, but I really didn't care that much for the job. It felt like I was being setup for a doormat position, within a huge company, where everybody makes 4 times as much, where I'd be doing boring work for the doormat above me.  

I'm still grateful though... The opportunity to interview isn't given to everyone.

---  
In other news,  

I'm almost done with reading Learn You a Haskell, only another chapter and a half more to go. I'd like to write a post eventually that goes into more detail about my thoughts on side-affect free and pure programming. I'll elaborate more on this later in it's own dedicated post -- but pure programming doesn't just save a person a lot of time in debugging, it changes the entire scope of the problem. Without having to worry about the machine and system a piece of code is running on, pure programming allows a person to know with certainty that the behavior of their code resides in the code itself and nothing else. This is, in fact, a big deal, and if you've ever spend a great deal of time trying to make code do what you want it to do (especially in a big system), you'll understand that machine level issues often end up turning a part of your application into a bit of a blackbox -- having to work around the system only leads to more issues down the line. With haskell, this is no longer an issue.


---  
At work,  

I'm setting up an instance of elastic search for a prototype feature for ModelMayhem, and so far it's been going very very smoothly -- of course the real challenge will come down to seeing how well it can handle a lot of traffic. I'm using it on a table with about +800,000 rows in it that comes out to about 22mb as a file. I've tested it on about 1/20 of the data and searches load up onto the client within 110ms-10ms. Yay!
I'll have to eventually do the same thing in sphinx, because the lead developer I'm working with only wants to work with sphinx, and he'd like to see it in sphinx to compare. It's been a fun assignment so far.


