import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { contentLocales, isContentLocale } from "@/lib/locales";
import { messages } from "@/lib/messages";

const copy = {
	en: {
		intro: "Hi, I’m Maxime. I’m an artist, and I like making things.",
		paragraphs: [
			"Sometimes that means writing code or making music. Other times, it’s designing an object, starting a project, or following an idea to see where it goes. Some things turn out better than others. I keep trying, learning as I go, and doing my best to become a better person along the way.",
			"Over the years, I’ve realized that nothing makes me happier than helping others (turns out Mum was right again). Sharing something I’ve learned, helping someone get started, or giving back in whatever way I can. I’d like the things I create to make the world a little better, even in small ways.",
			"This space is an open expression of that. A place for my work, my curiosity, and whatever I feel is worth sharing, with the hope that something here will resonate with you.",
			"You’ll find music, designs, objects, ideas, tutorials, and advice. Mostly, things I find beautiful, interesting, or useful. I hope you’ll find something here that means something to you, too.",
		],
	},
	fr: {
		intro:
			"Salut, moi c’est Maxime. Je suis artiste et j’aime créer des choses.",
		paragraphs: [
			"Du code, de la musique, des objets, des projets… J’aime partir d’une idée et voir ce que je peux en faire. Ça ne marche pas toujours comme je l’imaginais, mais j’essaie, j’apprends et je recommence. Je fais de mon mieux, dans ce que je crée comme dans la personne que j’essaie de devenir.",
			"Avec le temps, je me suis rendu compte que ce qui me rend le plus heureux, c’est d’aider les autres (encore une fois, maman avait raison). Transmettre ce que je sais, donner un coup de main, rendre un peu de ce qu’on m’a apporté. Si ce que je fais peut être utile à quelqu’un ou rendre les choses un peu meilleures, alors ça vaut la peine de le partager.",
			"Ce site n’a pas vraiment de but précis. C’est un endroit où je peux m’exprimer et partager ce que je fais, au gré de mes envies. J’espère que vous y trouverez quelque chose qui vous parle, vous inspire ou vous donne envie de créer à votre tour.",
			"Il y aura de la musique, du design, des objets, des idées, des tutos, des conseils… Un peu de tout, finalement. Tout ce que je trouve beau, cool ou utile, et que j’ai envie de partager avec vous.",
		],
	},
	es: {
		intro: "Hola, soy Maxime. Soy artista y me gusta crear cosas.",
		paragraphs: [
			"Código, música, objetos, proyectos… Me gusta partir de una idea y ver qué puedo hacer con ella. No siempre sale como imaginaba, pero pruebo, aprendo y vuelvo a intentarlo. Intento hacerlo lo mejor posible, tanto en lo que creo como en la persona que quiero llegar a ser.",
			"Con el tiempo, me he dado cuenta de que lo que más feliz me hace es ayudar a los demás (mamá tenía razón, una vez más). Compartir lo que sé, echar una mano y devolver un poco de lo que he recibido. Si lo que hago puede servirle a alguien o mejorar las cosas aunque sea un poco, merece la pena compartirlo.",
			"Este sitio no tiene un propósito concreto. Es un lugar donde expresarme y compartir lo que hago, según lo que me apetezca en cada momento. Espero que encuentres algo que te llegue, te inspire o te anime a crear tú también.",
			"Aquí habrá música, diseño, objetos, ideas, tutoriales, consejos… Un poco de todo, en realidad. Cualquier cosa que me parezca bonita, interesante o útil y que me apetezca compartir contigo.",
		],
	},
	pt: {
		intro: "Olá, sou o Maxime. Sou artista e gosto de criar coisas.",
		paragraphs: [
			"Código, música, objetos, projetos… Gosto de partir de uma ideia e ver o que consigo fazer com ela. Nem sempre corre como imaginava, mas experimento, aprendo e volto a tentar. Faço o meu melhor, tanto no que crio como na pessoa que quero ser.",
			"Com o tempo, percebi que nada me faz mais feliz do que ajudar os outros (a minha mãe tinha razão, mais uma vez). Partilhar o que sei, dar uma ajuda e retribuir um pouco do que recebi. Se aquilo que faço puder ser útil a alguém ou melhorar alguma coisa, mesmo que só um bocadinho, vale a pena partilhá-lo.",
			"Este site não tem um objetivo definido. É um espaço onde me posso expressar e partilhar o que faço, ao sabor das minhas vontades. Espero que encontres por aqui algo que te diga alguma coisa, te inspire ou te dê vontade de criar também.",
			"Vai haver música, design, objetos, ideias, tutoriais, conselhos… Um pouco de tudo, na verdade. Tudo o que acho bonito, giro ou útil e que me apetece partilhar contigo.",
		],
	},
};

export const ensureStatic = "navigation";

export function generateStaticParams() {
	return contentLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({
	params,
}: PageProps<"/[locale]/about">): Promise<Metadata> {
	const { locale } = await params;
	if (!isContentLocale(locale)) notFound();
	return {
		title: `${messages[locale].about} | 0xhq`,
		description: copy[locale].intro,
		alternates: {
			canonical: `/${locale}/about`,
			languages: Object.fromEntries(
				contentLocales.map((language) => [language, `/${language}/about`]),
			),
		},
	};
}

async function AboutContent({ params }: PageProps<"/[locale]/about">) {
	const { locale } = await params;
	if (!isContentLocale(locale)) notFound();
	const t = messages[locale];
	const content = copy[locale];
	return (
		<article lang={locale} className="w-full min-w-0 py-12">
			<h1 className="mb-8 text-5xl font-semibold leading-tight tracking-tight text-balance sm:text-6xl">
				{t.about}
			</h1>
			<div className="prose prose-zinc max-w-none font-sans dark:prose-invert">
				<p className="text-xl leading-relaxed">{content.intro}</p>
				{content.paragraphs.map((paragraph) => (
					<p key={paragraph}>{paragraph}</p>
				))}
				<p className="mt-8 font-mono text-sm">Maxime</p>
			</div>
		</article>
	);
}

export default function LocalizedAbout(props: PageProps<"/[locale]/about">) {
	return (
		<Suspense fallback={null}>
			<AboutContent {...props} />
		</Suspense>
	);
}
