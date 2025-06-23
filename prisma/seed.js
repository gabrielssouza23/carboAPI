import { PrismaClient } from '../src/generated/prisma/index.js';
const prisma = new PrismaClient()

async function main() {
  // 🔐 Admins convertidos da tabela original
  await prisma.user.createMany({
    data: [
      {
        id: "2a543f68-b2d1-48b6-8c20-3b27b8b399a5",
        name: "Gabriel",
        email: "gabriel@gmail.com",
        password: "49d77958fdfab0f80af78291c04df86b719f1807295dc2b2f41547b5ab6b0afe62a7388c1fe4706372276fec2ba6cd3902c265f311373b0920cf3f83b93fa60f",
        role: "ADMIN"
      },
      {
        id: "99ce7905-211d-4570-84a8-8432934de685",
        name: "Alexandre",
        email: "alexandre@gmail.com",
        password: "758529f56286c3da1d9cf43a2441809d30312395a597c7583c335cea8844a320d3dfcaf66a7549794e0f720244d3dc77d8a1e9e884d6e9bad1df99f27c9a9f33",
        role: "ADMIN"
      },
      {
        id: "f9ee1f00-4544-4dd6-9934-a0ba7069c597",
        name: "Krishna",
        email: "krishna@gmail.com",
        password: "11ace7e6b506baae2939c7ea709af9b73d1b118f87057f6228fcfe3763a890902c5faa45a83f62cae754b478d01268abf3da5f56b5640864595286eb9cd57e2a",
        role: "ADMIN"
      },
      {
        id: "1a6262ad-3dc2-46a9-abea-24cfc150c7ef",
        name: "Josué",
        email: "josué@gmail.com",
        password: "e1dbf7965c5e67fa6cb2ab686270e3c836ec56492fa588ad0da5c4d6445c8336c4e48b90cad11e525f87078208b18fd079b8691709c8e795671868e18eaac680",
        role: "ADMIN"
      }
    ]
  })

  // 💬 Participações extraídas
  await prisma.participation.createMany({
    data: [
      {
        id: 1,
        name: 'Grayce Hellen Romim Silva',
        location: 'São Paulo',
        message: 'Continuem com o trabalho incrível de vocês.',
        contact: 'grayceromim@alumni.usp.br',
        createdAt: new Date('2025-03-25T12:59:07.834Z'),
      },
      {
        id: 2,
        name: 'Francine Almeida',
        location: 'São Paulo',
        message:
          'Otima ideia, continuem desenvolvendo e divulgando o projeto pois é muito importante não só para a região de vcs como para o conhecimento de todos. Parabéns!!! Vida longa ao projeto !!!',
        contact: 'francinealmeida@alumni.usp.br',
        createdAt: new Date('2025-03-25T13:40:30.866Z'),
      },
      {
        id: 3,
        name: 'Matheus de Moraes dos Santos',
        location: 'São Paulo - SP',
        message: 'SENSACIONAL!',
        contact: 'maths.msantos@gmail.com',
        createdAt: new Date('2025-03-25T14:59:06.794Z'),
      },
      {
        id: 4,
        name: 'Katarine Norbertino',
        location: 'São Paulo (SP)',
        message: null,
        contact: 'katarine.norbertino@usp.br',
        createdAt: new Date('2025-03-25T18:36:10.495Z'),
      },
      {
        id: 5,
        name: 'Marco Arantes',
        location: 'São Paulo - SP',
        message: 'A ideia é muito boa, sugiro a importação de dados da Flora do Brasil.',
        contact: null,
        createdAt: new Date('2025-03-25T19:46:39.416Z'),
      },
      {
        id: 6,
        name: 'Bruno Backes Meller',
        location: 'São Paulo',
        message: 'Parabéns pela plataforma!! Estarei acompanhando para ver os próximos passos.',
        contact: 'bruno.meller@usp.br',
        createdAt: new Date('2025-03-26T13:20:23.888Z'),
      },
      {
        id: 7,
        name: 'Wandercleyson Uchôa Abreu',
        location: 'São Paulo',
        message: null,
        contact: '11939422478',
        createdAt: new Date('2025-03-26T14:31:24.691Z'),
      },
      {
        id: 8,
        name: 'Suzana Ursi',
        location: 'São Paulo',
        message:
          'Parabéns! Levantar e valorizar a biodiversidade é fundamental no país mais megadiverso do planeta. Destaque para o cuidado e inclusão das plantas!',
        contact: 'suzanaursi@usp.br @arte_e_botânica',
        createdAt: new Date('2025-03-26T18:32:34.922Z'),
      },
    ],
  });

  // 🌿 Espécie real + imagem do sistema + referência
  const especie = await prisma.species.create({
    data: {
      id: '99f35cea-befa-4648-a06a-94bc4399f7fa',
      commonName: 'Capim-sereno',
      scientificName: 'Eragrostis neesii',
      kingdom: 'Plantae',
      phylum: 'Angiosperma',
      class: 'Monocotyledoneae',
      order: 'Poales',
      family: 'Poaceae',
      genus: 'Eragrostis',
      specie: 'neesii',
      description: 'Espécie nativa da América do Sul, comum em biomas como Cerrado e Pampa.',
      thumbnailUrl: 'https://i.ibb.co/n8wPGh0g/8dbbce38794d.jpg',
      references: {
        create: {
          text: 'EMBRAPA (2022) - Uso de gramíneas em recuperação ambiental.'
        }
      },
      images: {
        create: {
          url: 'https://i.ibb.co/n8wPGh0g/8dbbce38794d.jpg',
          origin: 'SYSTEM',
          approved: true
        }
      }
    }
  })

  // 📸 Contribuição de usuário com imagens moderadas
  const contribution = await prisma.specieContribution.create({
    data: {
      userId: "2a543f68-b2d1-48b6-8c20-3b27b8b399a5", // Gabriel
      specieId: especie.id,
      latitude: -30.0974508,
      longitude: -51.7336921,
      location: 'Ifsul',
      phone: '51999152266',
      isPublic: true,
      images: {
        createMany: {
          data: [
            {
              url: 'https://i.ibb.co/9k3kk3LL/f60d328b628c.jpg',
              origin: 'CONTRIBUTION',
              approved: false
            },
            {
              url: 'https://i.ibb.co/mCQ8Txh/ecd875982a84.jpg',
              origin: 'CONTRIBUTION',
              approved: true
            }
          ]
        }
      }
    }
  })

  console.log('✅ Seed populado com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
