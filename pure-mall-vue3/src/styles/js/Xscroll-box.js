import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

// 注册插件，必须加这一行
gsap.registerPlugin(ScrollTrigger);

export function initScrollBox() {
    const lenis = new Lenis({
        duration: 1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        autoRaf: true,
    });
    const scrollbox = {
        wapper: document.querySelector(".wrapper"),
        cardsbox: document.querySelector(".cardsbox"),
        distance: 0,
        if_leave: false,
        init() {
            this.resize();
            window.addEventListener("resize", this.resize.bind(this));
            this.create_scrolltrigger();
        },
        create_scrolltrigger() {
            ScrollTrigger.create({
                trigger: this.wapper,
                start: "top top",
                end: "bottom bottom",
                onUpdate: (self) => {
                    this.cardsbox.style.transform = `translateX(-${self.progress * this.distance}px)`;
                },
                onLeave: () => {
                    this.if_leave = true;
                },
                onEnterBack: () => {
                    this.if_leave = false;
                }
            });
        },
        resize() {
            this.distance = Math.max(0, this.cardsbox.offsetWidth - innerWidth);
            this.wapper.style.height = `${this.distance}px`;
            if (this.if_leave) this.cardsbox.style.transform = `translateX(-${this.distance}px)`;
        }
    };
    scrollbox.init();
}