import { Logo } from './Logo'

export function AboutScreen() {
  return (
    <section className="screen about" id="about">
      <p className="siderail" aria-hidden="true">
        <span className="siderail-fill">the </span>
        <span className="siderail-stroke">art</span>
      </p>
      <div className="about-main">
        <Logo />
        <h2 className="about-copy">
          Hi I’m Marta Bensalem
          <br />
          UX/UI Designer. I create experiences
          <br />
          that are impactful and perhaps,
          <br />
          even a bit delightful.
        </h2>
        <p className="about-note">
          I want to be a part of a world where humanity
          <br />
          is essential to design.
        </p>
      </div>
      <svg className="about-tris" viewBox="0 0 460 760" fill="none" aria-hidden="true">
        <polygon points="70,20 450,90 40,430" stroke="#171717" strokeWidth="1.4" vectorEffect="nonScalingStroke" />
        <polygon points="130,40 470,160 90,520" stroke="#171717" strokeWidth="1.4" vectorEffect="nonScalingStroke" />
        <polygon points="40,140 400,230 80,700" stroke="#171717" strokeWidth="1.4" vectorEffect="nonScalingStroke" />
        <polygon points="160,180 460,300 150,680" stroke="#171717" strokeWidth="1.4" vectorEffect="nonScalingStroke" />
      </svg>
    </section>
  )
}
