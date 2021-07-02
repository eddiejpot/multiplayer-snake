module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Make playerList
    const playerNames = ['sunny', 'abcde', 'kong', 'barbie', 'cassie', 'andrew', 'jon', 'kai', 'akira', 'sam', 'YQ', 'Effy', 'Jo', 'Simbad'];
    const playerList = [];

    for (let i = 0; i < playerNames.length; i += 1) {
      playerList.push(
        {
          name: playerNames[i],
          score: Math.random() * 80 + 20, // random integer from 20 to 100:,
          created_at: new Date(),
          updated_at: new Date(),
        },
      );
    }
    // add playerList into players table
    await queryInterface.bulkInsert('players', playerList);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('players', null, {});
  },
};
