import dotenv from 'dotenv';
import { Command } from 'commander';

const program = new Command();
program.option('--mode <mode>', 'Modo de trabajo', 'DEVELOPMENT');
program.parse();

dotenv.config({
  path: program.opts().mode === 'DEVELOPMENT' ? './.env.development' : './.env.production',
});


process.env.NODE_ENV = program.opts().mode;

export default {
  port: process.env.PORT,
  clientId:process.env.GITHUB_CLIENT_ID,
  clientSecret:process.env.GITHUB_CLIENT_SECRET,
  mongoUrl: process.env.MONGO_URL,
  PERSISTENCE: process.env.PERSISTENCE,
};