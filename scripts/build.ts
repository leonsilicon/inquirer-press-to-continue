import { execaCommandSync as exec } from 'execa';
import { copyPackageFiles, chProjectDir } from 'lion-system';

chProjectDir(import.meta.url);
exec('tsup src/index.ts --format cjs,esm');
exec('tsc-alias');
copyPackageFiles();
