import {
  PrismaClient,
  PlayerPosition,
  PreferredFoot,
  AvailabilityStatus,
  VideoCategory,
  PhotoCategory,
  CareerEntryType,
  NationalTeamCategory,
  NewsCategory,
  UserRole,
} from "@prisma/client";
import bcrypt from "bcryptjs";
import slugify from "slugify";

import { CLUBS_ELITE_ONE, CLUBS_ELITE_TWO } from "./seed/clubs";
import { FIRST_NAMES, LAST_NAMES, CITIES_CAMEROON } from "./seed/names";
import { NEWS_SEED } from "./seed/news";
import { avatarUrl, crestUrl, photoUrl, SAMPLE_VIDEOS } from "./seed/media";

const prisma = new PrismaClient();

// Deterministic PRNG (mulberry32) so re-running seed gives stable demo data.
function mulberry32(seed: number) {
  return function rand() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260725);
const randInt = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;
const pick = <T>(arr: readonly T[]): T => arr[randInt(0, arr.length - 1)];
const chance = (p: number) => rand() < p;

const POSITIONS = Object.values(PlayerPosition);

function slug(...parts: string[]) {
  return slugify(parts.join("-"), { lower: true, strict: true });
}

async function main() {
  console.log("Seeding CFT database…");

  // -----------------------------------------------------------------------
  // Leagues & seasons
  // -----------------------------------------------------------------------
  const eliteOne = await prisma.league.upsert({
    where: { slug: "elite-one" },
    update: {},
    create: {
      slug: "elite-one",
      name: "MTN Elite One",
      type: "LEAGUE",
      tier: 1,
      logoUrl: crestUrl("elite-one"),
      description: "La première division du football camerounais.",
    },
  });

  const eliteTwo = await prisma.league.upsert({
    where: { slug: "elite-two" },
    update: {},
    create: {
      slug: "elite-two",
      name: "Elite Two",
      type: "LEAGUE",
      tier: 2,
      logoUrl: crestUrl("elite-two"),
      description: "La deuxième division du football camerounais.",
    },
  });

  const coupe = await prisma.league.upsert({
    where: { slug: "coupe-du-cameroun" },
    update: {},
    create: {
      slug: "coupe-du-cameroun",
      name: "Coupe du Cameroun",
      type: "CUP",
      tier: 1,
      logoUrl: crestUrl("coupe-du-cameroun"),
      description: "La compétition nationale à élimination directe.",
    },
  });

  const seasonPast = await prisma.season.upsert({
    where: { leagueId_label: { leagueId: eliteOne.id, label: "2023-2024" } },
    update: {},
    create: {
      leagueId: eliteOne.id,
      label: "2023-2024",
      startDate: new Date("2023-09-01"),
      endDate: new Date("2024-06-30"),
      isCurrent: false,
    },
  });

  const seasonCurrent = await prisma.season.upsert({
    where: { leagueId_label: { leagueId: eliteOne.id, label: "2024-2025" } },
    update: {},
    create: {
      leagueId: eliteOne.id,
      label: "2024-2025",
      startDate: new Date("2024-09-01"),
      endDate: new Date("2025-06-30"),
      isCurrent: true,
    },
  });

  const seasonTwoCurrent = await prisma.season.upsert({
    where: { leagueId_label: { leagueId: eliteTwo.id, label: "2024-2025" } },
    update: {},
    create: {
      leagueId: eliteTwo.id,
      label: "2024-2025",
      startDate: new Date("2024-09-01"),
      endDate: new Date("2025-06-30"),
      isCurrent: true,
    },
  });

  // -----------------------------------------------------------------------
  // Clubs
  // -----------------------------------------------------------------------
  const clubs: Awaited<ReturnType<typeof prisma.club.upsert>>[] = [];
  for (const c of CLUBS_ELITE_ONE) {
    const clubSlug = slug(c.name);
    const club = await prisma.club.upsert({
      where: { slug: clubSlug },
      update: {},
      create: {
        slug: clubSlug,
        name: c.name,
        shortName: c.short,
        city: c.city,
        stadiumName: c.stadium,
        stadiumCapacity: c.capacity,
        foundedYear: c.founded,
        coachName: c.coach,
        logoUrl: crestUrl(c.name),
        coverUrl: photoUrl(`${clubSlug}-cover`, 1600, 500),
        description: `Fondé en ${c.founded}, ${c.name} est un club historique du football camerounais basé à ${c.city}.`,
        leagueId: eliteOne.id,
      },
    });
    clubs.push(club);
  }

  const clubsEliteTwo = [];
  for (const c of CLUBS_ELITE_TWO) {
    const clubSlug = slug(c.name);
    const club = await prisma.club.upsert({
      where: { slug: clubSlug },
      update: {},
      create: {
        slug: clubSlug,
        name: c.name,
        shortName: c.short,
        city: c.city,
        stadiumName: c.stadium,
        stadiumCapacity: c.capacity,
        foundedYear: c.founded,
        coachName: c.coach,
        logoUrl: crestUrl(c.name),
        coverUrl: photoUrl(`${clubSlug}-cover`, 1600, 500),
        description: `Fondé en ${c.founded}, ${c.name} évolue en Elite Two.`,
        leagueId: eliteTwo.id,
      },
    });
    clubsEliteTwo.push(club);
  }

  // Standings — compute each club's record first, then rank by points (then
  // goal difference) so the "position" column always matches the table order.
  async function seedStandings(
    seasonId: string,
    clubList: typeof clubs,
    played: number,
    winRange: [number, number]
  ) {
    const records = clubList.map((club) => {
      const won = randInt(...winRange);
      const lost = randInt(0, played - won);
      const drawn = played - won - lost;
      const goalsFor = won * randInt(1, 2) + drawn;
      const goalsAgainst = lost * randInt(1, 2) + drawn;
      return {
        club,
        played,
        won,
        drawn,
        lost,
        goalsFor,
        goalsAgainst,
        points: won * 3 + drawn,
      };
    });

    records.sort((r1, r2) => r2.points - r1.points || r2.goalsFor - r2.goalsAgainst - (r1.goalsFor - r1.goalsAgainst));

    for (const [i, record] of records.entries()) {
      await prisma.leagueStanding.upsert({
        where: { seasonId_clubId: { seasonId, clubId: record.club.id } },
        update: {},
        create: {
          seasonId,
          clubId: record.club.id,
          position: i + 1,
          played: record.played,
          won: record.won,
          drawn: record.drawn,
          lost: record.lost,
          goalsFor: record.goalsFor,
          goalsAgainst: record.goalsAgainst,
          points: record.points,
        },
      });
    }
  }

  await seedStandings(seasonCurrent.id, clubs, 20, [4, 15]);
  await seedStandings(seasonTwoCurrent.id, clubsEliteTwo, 16, [3, 12]);

  // Fixtures (calendar) for Elite One current season
  const today = new Date();
  for (let round = 1; round <= 6; round++) {
    const shuffled = [...clubs].sort(() => rand() - 0.5);
    for (let i = 0; i < shuffled.length; i += 2) {
      const home = shuffled[i];
      const away = shuffled[i + 1];
      if (!home || !away) continue;
      const matchDate = new Date(today);
      matchDate.setDate(matchDate.getDate() + (round - 3) * 7);
      const isPast = matchDate < today;
      await prisma.match.create({
        data: {
          seasonId: seasonCurrent.id,
          leagueId: eliteOne.id,
          homeClubId: home.id,
          awayClubId: away.id,
          matchDate,
          venue: home.stadiumName,
          round: `Journée ${round}`,
          status: isPast ? "FINISHED" : "SCHEDULED",
          homeScore: isPast ? randInt(0, 4) : null,
          awayScore: isPast ? randInt(0, 4) : null,
        },
      });
    }
  }

  // -----------------------------------------------------------------------
  // National teams / agents / academies
  // -----------------------------------------------------------------------
  const nationalTeamA = await prisma.nationalTeam.create({
    data: { name: "Lions Indomptables A", category: NationalTeamCategory.SENIOR, logoUrl: crestUrl("lions-a") },
  });
  const nationalTeamU23 = await prisma.nationalTeam.create({
    data: { name: "Lions Indomptables U23", category: NationalTeamCategory.U23, logoUrl: crestUrl("lions-u23") },
  });
  const nationalTeamU20 = await prisma.nationalTeam.create({
    data: { name: "Lions Indomptables U20", category: NationalTeamCategory.U20, logoUrl: crestUrl("lions-u20") },
  });
  const nationalTeams = [nationalTeamA, nationalTeamU23, nationalTeamU20];

  const agents = [];
  for (const name of ["Global Sports Management", "Africa Talents Agency", "Pro Vision Sports"]) {
    agents.push(
      await prisma.agent.create({
        data: {
          name,
          agencyName: name,
          email: `${slug(name)}@agency.example.com`,
          phone: "+237 6 90 00 00 00",
          photoUrl: crestUrl(name),
          bio: `${name} accompagne des joueurs camerounais dans leur carrière professionnelle.`,
        },
      })
    );
  }

  const academies = [];
  for (const [i, city] of ["Yaoundé", "Douala", "Garoua"].entries()) {
    const name = `Académie Étoile ${city}`;
    academies.push(
      await prisma.academy.create({
        data: {
          slug: slug(name, String(i)),
          name,
          city,
          logoUrl: crestUrl(name),
          foundedYear: 2005 + i,
          contactEmail: `contact@${slug(name)}.example.com`,
          description: `Centre de formation de référence basé à ${city}, dédié à la détection et au développement des jeunes talents.`,
        },
      })
    );
  }

  // -----------------------------------------------------------------------
  // Users (admin + demo accounts per role)
  // -----------------------------------------------------------------------
  const passwordHash = await bcrypt.hash("Password123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@cft.cm" },
    update: {},
    create: {
      name: "Admin CFT",
      email: "admin@cft.cm",
      role: UserRole.ADMIN,
      passwordHash,
    },
  });

  const demoRecruiter = await prisma.user.upsert({
    where: { email: "recruteur@cft.cm" },
    update: {},
    create: {
      name: "Marc Recruteur",
      email: "recruteur@cft.cm",
      role: UserRole.RECRUITER,
      passwordHash,
    },
  });

  const demoClubUser = await prisma.user.upsert({
    where: { email: "club@cft.cm" },
    update: {},
    create: {
      name: `Direction ${clubs[0].name}`,
      email: "club@cft.cm",
      role: UserRole.CLUB,
      passwordHash,
      clubId: clubs[0].id,
    },
  });

  // -----------------------------------------------------------------------
  // Players
  // -----------------------------------------------------------------------
  const allClubs = [...clubs, ...clubsEliteTwo];
  const PLAYER_COUNT = 32;
  const usedNames = new Set<string>();
  const players = [];

  for (let i = 0; i < PLAYER_COUNT; i++) {
    let firstName = pick(FIRST_NAMES);
    let lastName = pick(LAST_NAMES);
    while (usedNames.has(`${firstName}-${lastName}`)) {
      firstName = pick(FIRST_NAMES);
      lastName = pick(LAST_NAMES);
    }
    usedNames.add(`${firstName}-${lastName}`);

    const position = POSITIONS[i % POSITIONS.length];
    const isFreeAgent = i >= PLAYER_COUNT - 2;
    const club = isFreeAgent ? null : allClubs[(i + Math.floor(i / 10)) % allClubs.length];

    const age = randInt(17, 32);
    const birthDate = new Date();
    birthDate.setFullYear(birthDate.getFullYear() - age);
    birthDate.setMonth(randInt(0, 11), randInt(1, 28));

    const isGK = position === "GOALKEEPER";
    const isDefender = position.includes("BACK") || position === "DEFENSIVE_MIDFIELD";
    const isAttacker = ["LEFT_WINGER", "RIGHT_WINGER", "STRIKER", "ATTACKING_MIDFIELD"].includes(position);

    const heightCm = isGK ? randInt(185, 198) : isDefender ? randInt(178, 192) : randInt(168, 185);
    const weightKg = Math.round(heightCm * 0.44 + randInt(-4, 6));

    const availability: AvailabilityStatus = isFreeAgent
      ? AvailabilityStatus.FREE_AGENT
      : chance(0.25)
        ? AvailabilityStatus.TRANSFER_AVAILABLE
        : chance(0.4)
          ? AvailabilityStatus.LOAN_AVAILABLE
          : AvailabilityStatus.NOT_AVAILABLE;

    const baseValue = isFreeAgent ? randInt(0, 50_000) : randInt(80_000, 3_500_000);
    const ageFactor = age < 23 ? 1.3 : age > 29 ? 0.6 : 1;
    const estimatedValue = Math.round((baseValue * ageFactor) / 5000) * 5000;

    const playerSlug = slug(firstName, lastName, String(i));

    const player = await prisma.player.create({
      data: {
        slug: playerSlug,
        firstName,
        lastName,
        photoUrl: avatarUrl(playerSlug),
        coverUrl: photoUrl(`${playerSlug}-cover`, 1400, 500),
        birthDate,
        birthCity: pick(CITIES_CAMEROON),
        nationality: "Cameroun",
        heightCm,
        weightKg,
        preferredFoot: chance(0.75)
          ? PreferredFoot.RIGHT
          : chance(0.7)
            ? PreferredFoot.LEFT
            : PreferredFoot.BOTH,
        position,
        shirtNumber: randInt(1, 34),
        clubId: club?.id ?? null,
        academyId: chance(0.4) ? pick(academies).id : null,
        agentId: chance(0.5) ? pick(agents).id : null,
        contractEndDate: club ? new Date(2025 + randInt(0, 3), 5, 30) : null,
        estimatedValue,
        availability,
        bio: `${firstName} ${lastName} est un ${POSITION_LABELS[position]} camerounais évoluant${
          club ? ` à ${club.name}` : ""
        }, reconnu pour son sérieux et sa marge de progression.`,
        status: chance(0.85) ? "APPROVED" : "PENDING",
        featured: chance(0.25),
      },
    });
    players.push({ player, position, isGK, isDefender, isAttacker, club, age });

    // Technical profile -----------------------------------------------------
    const base = () => randInt(45, 92);
    await prisma.technicalProfile.create({
      data: {
        playerId: player.id,
        speed: isAttacker ? randInt(70, 96) : base(),
        technique: isAttacker || position === "CENTER_MIDFIELD" ? randInt(70, 95) : base(),
        vision: position.includes("MIDFIELD") ? randInt(70, 95) : base(),
        power: isDefender || isGK ? randInt(65, 92) : base(),
        aerialDuel: isGK || isDefender ? randInt(70, 96) : base(),
        acceleration: isAttacker ? randInt(72, 97) : base(),
        stamina: randInt(60, 95),
        leadership: randInt(45, 90),
        discipline: randInt(50, 95),
        positioning: isDefender || isGK ? randInt(70, 95) : base(),
        control: isAttacker || position.includes("MIDFIELD") ? randInt(68, 94) : base(),
        finishing: isAttacker ? randInt(70, 96) : isGK ? randInt(20, 40) : base(),
      },
    });

    // Statistics (past + current season) ------------------------------------
    for (const season of [seasonPast, seasonCurrent]) {
      const matches = randInt(8, 28);
      const starts = randInt(Math.max(0, matches - 8), matches);
      const goals = isGK ? 0 : isAttacker ? randInt(0, 18) : isDefender ? randInt(0, 4) : randInt(0, 9);
      const assists = isGK ? 0 : randInt(0, isAttacker ? 12 : 6);
      await prisma.playerStatistics.create({
        data: {
          playerId: player.id,
          seasonId: season.id,
          clubId: club?.id ?? null,
          matches,
          starts,
          minutesPlayed: starts * randInt(70, 90) + (matches - starts) * randInt(10, 30),
          goals,
          assists,
          shots: goals * randInt(2, 5) + randInt(0, 10),
          shotsOnTarget: goals + randInt(0, 8),
          dribbles: isAttacker ? randInt(10, 90) : randInt(0, 30),
          interceptions: isDefender ? randInt(20, 80) : randInt(2, 25),
          duelsWon: randInt(20, 140),
          fouls: randInt(2, 40),
          yellowCards: randInt(0, 7),
          redCards: chance(0.1) ? 1 : 0,
          penalties: chance(0.15) ? randInt(1, 4) : 0,
          passAccuracy: Math.round((isGK ? randInt(55, 80) : randInt(65, 94)) * 10) / 10,
          successfulCrosses: isAttacker || position.includes("BACK") ? randInt(0, 40) : randInt(0, 8),
        },
      });
    }

    // Videos ------------------------------------------------------------------
    const videoCategories: (typeof VideoCategory)[keyof typeof VideoCategory][] = [
      VideoCategory.HIGHLIGHTS,
      VideoCategory.FULL_MATCH,
      VideoCategory.COMPILATION,
      VideoCategory.TRAINING,
      VideoCategory.INTERVIEW,
    ];
    const videoCount = randInt(2, 5);
    for (let v = 0; v < videoCount; v++) {
      const category = videoCategories[v % videoCategories.length];
      await prisma.playerVideo.create({
        data: {
          playerId: player.id,
          title: `${firstName} ${lastName} — ${VIDEO_LABELS[category]}`,
          url: pick(SAMPLE_VIDEOS),
          thumbnailUrl: photoUrl(`${playerSlug}-video-${v}`, 640, 360),
          category,
          durationSec: randInt(45, 720),
          views: randInt(20, 25000),
        },
      });
    }

    // Photos --------------------------------------------------------------
    const photoCategories: (typeof PhotoCategory)[keyof typeof PhotoCategory][] = [
      PhotoCategory.PORTRAIT,
      PhotoCategory.ACTION,
      PhotoCategory.MATCH,
      PhotoCategory.TRAINING,
    ];
    for (let p = 0; p < randInt(3, 6); p++) {
      const category = photoCategories[p % photoCategories.length];
      await prisma.playerPhoto.create({
        data: {
          playerId: player.id,
          url: photoUrl(`${playerSlug}-photo-${p}`, 800, 1000),
          category,
          caption: `${PHOTO_LABELS[category]} — ${firstName} ${lastName}`,
        },
      });
    }

    // Career history --------------------------------------------------------
    if (club) {
      await prisma.careerHistory.create({
        data: {
          playerId: player.id,
          clubId: club.id,
          clubName: club.name,
          type: CareerEntryType.CLUB,
          startDate: new Date(2024 - randInt(0, 4), 6, 1),
          appearances: randInt(10, 90),
          goals: isAttacker ? randInt(0, 30) : randInt(0, 6),
        },
      });
    }
    if (chance(0.5)) {
      const formerClub = pick(allClubs.filter((c) => c.id !== club?.id));
      const start = new Date(2018 + randInt(0, 3), 6, 1);
      const end = new Date(start.getFullYear() + randInt(1, 3), 5, 30);
      await prisma.careerHistory.create({
        data: {
          playerId: player.id,
          clubId: formerClub.id,
          clubName: formerClub.name,
          type: CareerEntryType.CLUB,
          startDate: start,
          endDate: end,
          appearances: randInt(5, 60),
          goals: randInt(0, 15),
        },
      });

      if (chance(0.6)) {
        await prisma.transfer.create({
          data: {
            playerId: player.id,
            fromClubId: formerClub.id,
            toClubId: club?.id,
            transferDate: end,
            transferFee: chance(0.5) ? randInt(10_000, 250_000) : null,
            type: chance(0.7) ? "PERMANENT" : "LOAN",
            status: "COMPLETED",
            window: chance(0.5) ? "SUMMER" : "WINTER",
          },
        });
      }
    }

    // Honors ------------------------------------------------------------------
    if (chance(0.3)) {
      await prisma.honor.create({
        data: {
          playerId: player.id,
          title: pick(["Champion du Cameroun", "Vainqueur de la Coupe du Cameroun", "Meilleur buteur Elite One", "Meilleur espoir de la saison"]),
          competition: pick(["Elite One", "Coupe du Cameroun"]),
          seasonLabel: pick(["2021-2022", "2022-2023", "2023-2024"]),
        },
      });
    }

    // National team calls -----------------------------------------------------
    if (chance(0.35)) {
      await prisma.nationalTeamCall.create({
        data: {
          playerId: player.id,
          nationalTeamId: age < 20 ? nationalTeamU20.id : age < 23 ? nationalTeamU23.id : nationalTeamA.id,
          caps: randInt(1, 45),
          goals: isAttacker ? randInt(0, 12) : randInt(0, 3),
          competition: "CAN / Éliminatoires Coupe du Monde",
        },
      });
    }

    // Injuries / suspensions ---------------------------------------------------
    if (chance(0.15)) {
      const start = new Date(today);
      start.setDate(start.getDate() - randInt(5, 60));
      const ongoing = chance(0.4);
      await prisma.injury.create({
        data: {
          playerId: player.id,
          description: pick(["Élongation aux ischio-jambiers", "Entorse de la cheville", "Blessure au genou", "Douleurs musculaires au mollet"]),
          severity: pick(["MINOR", "MODERATE", "SEVERE"]),
          status: ongoing ? "ONGOING" : "RECOVERED",
          startDate: start,
          endDate: ongoing ? null : new Date(start.getTime() + randInt(7, 45) * 86400000),
        },
      });
    }
    if (chance(0.08)) {
      const start = new Date(today);
      start.setDate(start.getDate() - randInt(0, 20));
      await prisma.suspension.create({
        data: {
          playerId: player.id,
          reason: pick(["Cumul d'avertissements", "Carton rouge direct", "Décision disciplinaire"]),
          competition: "Elite One",
          matchesBanned: randInt(1, 3),
          startDate: start,
          endDate: new Date(start.getTime() + randInt(7, 21) * 86400000),
        },
      });
    }
  }

  // Link a demo user to one approved player for the "player dashboard" role
  const demoPlayerRecord = players.find((p) => p.club)?.player;
  if (demoPlayerRecord) {
    await prisma.user.upsert({
      where: { email: "joueur@cft.cm" },
      update: {},
      create: {
        name: `${demoPlayerRecord.firstName} ${demoPlayerRecord.lastName}`,
        email: "joueur@cft.cm",
        role: UserRole.PLAYER,
        passwordHash,
      },
    });
    await prisma.player.update({
      where: { id: demoPlayerRecord.id },
      data: {
        user: { connect: { email: "joueur@cft.cm" } },
        status: "APPROVED",
        featured: true,
      },
    });
  }

  // -----------------------------------------------------------------------
  // Favorites (recruiter demo)
  // -----------------------------------------------------------------------
  const favoritePlayers = players.slice(0, 5);
  for (const { player } of favoritePlayers) {
    await prisma.favorite.upsert({
      where: { recruiterId_playerId: { recruiterId: demoRecruiter.id, playerId: player.id } },
      update: {},
      create: { recruiterId: demoRecruiter.id, playerId: player.id },
    });
  }

  // -----------------------------------------------------------------------
  // News
  // -----------------------------------------------------------------------
  for (const [i, n] of NEWS_SEED.entries()) {
    const newsSlug = slug(n.title, String(i));
    await prisma.news.upsert({
      where: { slug: newsSlug },
      update: {},
      create: {
        slug: newsSlug,
        title: n.title,
        excerpt: n.excerpt,
        content: `${n.excerpt}\n\nLa rédaction de CFT continuera de suivre cette actualité de près et vous tiendra informés des prochains développements concernant le football camerounais.\n\nCette information illustre la vitalité du football local et l'intérêt croissant que suscitent les talents camerounais auprès des recruteurs internationaux.`,
        coverImageUrl: photoUrl(`news-${i}`, 1200, 700),
        category: NewsCategory[n.category],
        authorId: admin.id,
        published: true,
        publishedAt: new Date(today.getTime() - i * 86400000 * 2),
        views: randInt(50, 5000),
      },
    });
  }

  // -----------------------------------------------------------------------
  // Notifications & messages (demo)
  // -----------------------------------------------------------------------
  await prisma.notification.createMany({
    data: [
      {
        userId: demoRecruiter.id,
        type: "NEW_PLAYER",
        title: "Nouveau joueur disponible",
        message: `${players[0].player.firstName} ${players[0].player.lastName} vient de rejoindre la plateforme.`,
        link: `/joueurs/${players[0].player.slug}`,
      },
      {
        userId: demoRecruiter.id,
        type: "NEW_VIDEO",
        title: "Nouvelle vidéo disponible",
        message: `Une nouvelle vidéo highlights a été ajoutée pour ${players[1].player.firstName} ${players[1].player.lastName}.`,
        link: `/joueurs/${players[1].player.slug}`,
      },
      {
        userId: demoClubUser.id,
        type: "TRANSFER",
        title: "Rumeur de transfert",
        message: "Un recruteur a manifesté de l'intérêt pour un joueur de votre effectif.",
      },
    ],
  });

  await prisma.message.create({
    data: {
      senderId: demoRecruiter.id,
      receiverId: demoClubUser.id,
      content:
        "Bonjour, je suis intéressé par un de vos joueurs. Serait-il possible d'obtenir davantage d'informations et un accès à ses dernières vidéos ?",
    },
  });
  await prisma.message.create({
    data: {
      senderId: demoClubUser.id,
      receiverId: demoRecruiter.id,
      content: "Bonjour, bien sûr. Je vous transmets son dossier complet dans la journée.",
    },
  });

  await prisma.subscription.upsert({
    where: { userId: demoRecruiter.id },
    update: {},
    create: { userId: demoRecruiter.id, plan: "RECRUITER_PRO", status: "ACTIVE" },
  });

  console.log(`Seed terminé : ${players.length} joueurs, ${allClubs.length} clubs, ${NEWS_SEED.length} actualités.`);
  console.log("Comptes de démonstration (mot de passe : Password123!) :");
  console.log("  admin@cft.cm      (ADMIN)");
  console.log("  recruteur@cft.cm  (RECRUITER)");
  console.log("  club@cft.cm       (CLUB)");
  console.log("  joueur@cft.cm     (PLAYER)");
}

const POSITION_LABELS: Record<string, string> = {
  GOALKEEPER: "gardien de but",
  CENTER_BACK: "défenseur central",
  LEFT_BACK: "arrière gauche",
  RIGHT_BACK: "arrière droit",
  DEFENSIVE_MIDFIELD: "milieu défensif",
  CENTER_MIDFIELD: "milieu central",
  ATTACKING_MIDFIELD: "milieu offensif",
  LEFT_WINGER: "ailier gauche",
  RIGHT_WINGER: "ailier droit",
  STRIKER: "attaquant",
};

const VIDEO_LABELS: Record<string, string> = {
  HIGHLIGHTS: "Highlights",
  FULL_MATCH: "Match complet",
  COMPILATION: "Compilation",
  TRAINING: "Entraînement",
  INTERVIEW: "Interview",
};

const PHOTO_LABELS: Record<string, string> = {
  PORTRAIT: "Portrait",
  ACTION: "Action",
  MATCH: "Match",
  TRAINING: "Entraînement",
  NATIONAL_TEAM: "Sélection nationale",
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
