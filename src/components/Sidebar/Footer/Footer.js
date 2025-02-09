import clsx from "clsx";
import styles from "./Footer.module.scss";
import { CopyRightIcon } from "~/components/Icons";
function Footer() {
  return (
    <div className={clsx(styles.footer)}>
      <div className={clsx(styles.link)}>
        <a href="/">About</a>
        <a href="/">TikTok Browse</a>
        <a href="/">Newsroom</a>
        <a href="/">Contact</a>
        <a href="/">Careers</a>
        <a href="/">ByteDance</a>
      </div>
      <div className={clsx(styles.link)}>
        <a href="/">TikTok for Good</a>
        <a href="/">Advertise</a>
        <a href="/">Developers</a>
        <a href="/">Transparency</a>
        <a href="/">TikTok Rewards</a>
      </div>
      <div className={clsx(styles.link)}>
        <a href="/">Help</a>
        <a href="/">Safety</a>
        <a href="/">Terms</a>
        <a href="/">Privacy</a>
        <a href="/">Creator Portal</a>
        <a href="/">Community Guidelines</a>
      </div>
      <div className={clsx(styles.copyRight)}>
        <CopyRightIcon width="1.4rem" height="1.4rem" className={clsx(styles.icon)}/>
        <a href="https://github.com/QuyDevit/tiktok-ui">2025 TikTok - Made by QuyDevit</a>
      </div>
    </div>
  );
}

export default Footer;
