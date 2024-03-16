import React from 'react';
import getCardCollection from '@/app/libs/getCardCollection';
import Image from 'next/image';
import Header from '../components/Header';

export default async function Page() {
	const collection = await getCardCollection();

	return (
		<main>
			<Header />
			<div>This is your collection</div>
			{collection.map((card) => (
				<div key={card.id}>
					<Image src={card.image} alt={card.name} width={200} height={300} />
				</div>
			))}
		</main>
	);
}
