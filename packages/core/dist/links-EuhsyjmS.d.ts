declare const APPS: {
    /**
     * @dev 0_0xbuidlerhq.
     */
    readonly "0_0xbuidlerhq": {
        readonly url: "https://0xbuidlerhq.com";
        readonly name: "0xBuidlerHQ";
    };
    /**
     * @dev 1_betterlido.
     */
    readonly "1_betterlido": {
        readonly url: "https://betterlido.0xbuidlerhq.com";
        readonly name: "BetterLido";
    };
    /**
     * @dev 2_dusk-explorer.
     */
    readonly "2_dusk-explorer": {
        readonly url: "https://duskexplorer.0xbuidlerhq.com";
        readonly name: "Dusk Explorer";
    };
    /**
     * @dev 3_utilityaf.
     */
    readonly "3_utilityaf": {
        readonly url: "https://utilityaf.0xbuidlerhq.com";
        readonly name: "UtilityAf";
    };
    /**
     * @dev ethos.xyz.
     */
    readonly ethos_xyz: {
        readonly url: "https://ethos.xyz";
        readonly socials: {
            readonly x: "https://x.com/0xBuidlerHQ";
            readonly discord: "https://discord.gg/VdvP9rFzkM";
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
    twitch: string;
    spotify: string;
    hq_github: string;
};

declare const links_APPS: typeof APPS;
declare const links_GLOBAL: typeof GLOBAL;
declare namespace links {
  export { links_APPS as APPS, links_GLOBAL as GLOBAL };
}

export { APPS as A, GLOBAL as G, links as l };
