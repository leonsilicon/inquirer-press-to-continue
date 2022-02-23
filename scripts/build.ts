import { execaCommandSync as exec } from 'execa';
import { copyPackageFiles, chProjectDir, rmDist } from 'lion-system';

chProjectDir(import.meta.url);
rmDist();
exec('tsc');
exec('tsc-alias');
copyPackageFiles();
