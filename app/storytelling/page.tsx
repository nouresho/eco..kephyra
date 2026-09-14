export default function StorytellingPage() {
  return (
    <main className="story-editorial">

      <section className="story-editorial-section">
        <div className="story-editorial-container">

          {/* TOP */}
          <div className="story-editorial-top">

            <div className="story-editorial-title-wrap">
              <h1 className="story-editorial-title">
                OUR
                <br />
                STORY
              </h1>

              <p className="story-editorial-accent">
                More than a ride
              </p>
            </div>

            <div className="story-editorial-intro">
              <p>
                ECO KEPHYRA IS NOT JUST ABOUT ELECTRIC SCOOTERS.
              </p>
            </div>

          </div>


          {/* IMAGE */}
          <div className="story-editorial-image">
            <img
              src="/images/story.png"
              alt="ECO KEPHYRA coast"
            />
          </div>


          {/* CONTENT */}
          <div className="story-editorial-content">

            {/* LEFT COLUMN */}
            <div className="story-editorial-column">

              <p>
                It is an invitation to discover the coast in a different way.
              </p>

              <p>
                An invitation to explore the most beautiful places nature has
                given us, without harming them.
              </p>

              <p>
                We believe a journey should not leave behind noise, smoke,
                or anything that takes away from the beauty of the places
                we visit.
              </p>

            </div>


            {/* RIGHT COLUMN */}
            <div className="story-editorial-column">

              <p>
                We believe in the freedom to move, to explore, to reach the
                beach, the mountains, the next wave, the next sunset…
                without leaving behind anything that could harm or disturb
                these places.
              </p>

              <div className="story-editorial-statement">
                WITHOUT
                <br />
                LEAVING
                <br />
                A TRACE.
              </div>

            </div>

          </div>


          {/* FINAL TEXT */}
          <div className="story-editorial-bottom">

            <div>
              <p>
                These coasts are not simply tourist destinations.
              </p>

              <p>
                They are home to the sea, the wind, the earth,
                and life itself.
              </p>
            </div>

            <div>
              <p>
                That is why we chose a way of moving that allows you to explore
                and enjoy the region while respecting nature and preserving
                the elements that give it its unique beauty.
              </p>
            </div>

          </div>




        </div>
      </section>

    </main>
  );
}