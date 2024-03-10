/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		dangerouslyAllowSVG: true,
		remotePatterns: [
			{ hostname: 'svgs.scryfall.io' },
			{ hostname: 'cards.scryfall.io' },
		],
	},
};

export default nextConfig;
