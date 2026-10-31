import type { ContentLocale } from "./locales";

type NewsletterCopy = {
	title: string;
	description: string;
	email: string;
	subscribe: string;
	pending: string;
	close: string;
	socials: string;
	reassurance: string;
};

export const newsletterMessages = {
	en: {
		title: "Stay close.",
		description:
			"Occasional notes, unfinished things, and a first look at what I’m making.",
		email: "Your email address",
		subscribe: "Subscribe",
		pending: "Subscribing…",
		close: "Close",
		socials: "Find me here.",
		reassurance:
			"Just the occasional email from me. Unsubscribe whenever you like.",
	},
	fr: {
		title: "On garde le contact ?",
		description:
			"Quelques nouvelles, des projets en cours et un premier aperçu de ce que je prépare.",
		email: "Votre adresse e-mail",
		subscribe: "S’inscrire",
		pending: "Inscription…",
		close: "Fermer",
		socials: "Retrouvez-moi ici.",
		reassurance:
			"Un petit mot de temps en temps. Vous pouvez vous désinscrire quand vous voulez.",
	},
	es: {
		title: "¿Seguimos en contacto?",
		description:
			"Alguna que otra nota, proyectos en marcha y un primer vistazo a lo que estoy creando.",
		email: "Tu correo electrónico",
		subscribe: "Suscribirme",
		pending: "Suscribiendo…",
		close: "Cerrar",
		socials: "Puedes seguirme aquí.",
		reassurance:
			"Un correo de vez en cuando. Puedes darte de baja cuando quieras.",
	},
	pt: {
		title: "Vamos mantendo o contacto?",
		description:
			"Novidades de vez em quando, projetos em curso e um primeiro olhar sobre o que estou a criar.",
		email: "O teu endereço de e-mail",
		subscribe: "Subscrever",
		pending: "A subscrever…",
		close: "Fechar",
		socials: "Podes acompanhar-me por aqui.",
		reassurance:
			"Um e-mail de vez em quando. Podes cancelar a subscrição quando quiseres.",
	},
} satisfies Record<ContentLocale, NewsletterCopy>;
