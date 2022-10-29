import prisma from '../index';

async function main() {
  await prisma.project.createMany({
    data: [
      {
        feedUrl: 'https://bitcorns.com/api/cards',
        name: 'Bitcorn',
        slug: 'bitcorn',
        telegramUrl: 'https://t.me/bitcorns',
        twitterUrl: 'https://twitter.com/bitcorncrops',
        websiteUrl: 'https://www.bitcorns.com/',
      },
      {
        feedUrl: 'https://droolingapebus.club/api/verbose-feed',
        name: 'Drooling Ape Bus Club',
        slug: 'drooling-apes',
        telegramUrl: 'https://t.me/drooling_ape_bus_club',
        twitterUrl: 'https://twitter.com/DroolingApes',
        websiteUrl: 'https://droolingapebus.club/',
      },
      {
        feedUrl: 'http://phunchkins.com/wp-json/phunchkins/feed',
        name: 'Phunchkins',
        slug: 'phunchkins',
        telegramUrl: 'https://t.me/phunchkins',
        twitterUrl: 'https://twitter.com/Phunchkins',
        websiteUrl: 'https://phunchkins.com/',
      },
      {
        feedUrl: 'https://www.retro-xcp.art/api/retro-feed',
        name: 'Retro XCP',
        slug: 'retro-xcp',
        telegramUrl: 'https://t.me/retroid_xcp',
        twitterUrl: 'https://twitter.com/RetroXcp',
        websiteUrl: 'https://www.retro-xcp.art/',
      },
      {
        feedUrl: 'https://thewojakway.com/wojakway-collection.json',
        name: 'The Wojak Way',
        slug: 'wojaks',
        telegramUrl: 'https://t.me/thewojakway',
        twitterUrl: 'https://twitter.com/thewojakway',
        websiteUrl: 'http://thewojakway.com/',
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
