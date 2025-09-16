export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("users", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    uid: {
      type: Sequelize.STRING, // defaults to VARCHAR(255)
      allowNull: false,
      unique: true,
    },
    full_name: {
      type: Sequelize.STRING, // defaults to VARCHAR(255)
      allowNull: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true, // emails should be unique
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phone_number: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    verification_code: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    verification_code_expiration: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    time_zone: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    is_verified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn("NOW"),
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn("NOW"),
    },
  });
}

export async function down(queryInterface, _Sequelize) {
  await queryInterface.dropTable("users");
}
