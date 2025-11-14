declare const APPS: {
    /**
     * @dev ethos.xyz.
     */
    readonly ethos_xyz: {
        readonly url: "https://ethos.xyz";
        readonly socials: {
            readonly discord: "https://discord.gg/VdvP9rFzkM";
            readonly twitter: "https://x.com/0xBuidlerHQ";
            readonly telegram: "https://t.me/@the0xbuidler";
            readonly github: "https://github.com/0xBuidlerHQ";
        };
    };
};
declare const GLOBAL: {
    x: string;
    github: string;
    telegram: string;
    youtube: string;
};

declare const links_APPS: typeof APPS;
declare const links_GLOBAL: typeof GLOBAL;
declare namespace links {
  export { links_APPS as APPS, links_GLOBAL as GLOBAL };
}

export { APPS as A, GLOBAL as G, links as l };
