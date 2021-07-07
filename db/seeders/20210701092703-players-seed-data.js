module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Make playerList
    const playerNames = ['sunny', 'abcde', 'kong', 'barbie', 'cassie', 'andrew', 'jon', 'kenny', 'aik', 'boi', 'JJ', 'Zack', 'John', 'Simbad', 'Kenji', 'Ken', 'Philip', 'Draco', 'Voldermot', 'Ron', 'Weasley', 'Spyderman', 'Luke', 'Chicken', 'Banana', 'Rick', 'Morty', 'Bojack', 'DavyJones', 'Mummy', 'Maccas', 'ILoveToWin'];
    const playerList = [];

    for (let i = 0; i < playerNames.length; i += 1) {
      playerList.push(
        {
          name: playerNames[i],
          score: Math.random() * 50 + 1, // random integer from 1 to 50:,
          created_at: new Date(),
          updated_at: new Date(),
        },
      );
    }

    playerList.push(
      {
        name: 'rockbottem',
        score: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
    );
    // add playerList into players table
    await queryInterface.bulkInsert('players', playerList);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('players', null, {});
  },
};
