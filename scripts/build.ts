import { execaCommandSync as exec } from 'execa';
import { copyPackageFiles, chProjectDir, rmDist } from 'lion-system';

chProjectDir(import.meta.url);
rmDist();
exec('tsup src/index.ts --format cjs,esm --dts');
exec('tsc-alias');
copyPackageFiles();
