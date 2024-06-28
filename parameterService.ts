import * as fsExtra from 'fs-extra';
import * as fs from 'fs';
import * as path from 'path';
import { withDir, withFile } from 'tmp-promise';
import promisePipe from 'promisepipe';

import FileContentStorage from './packages/h5p-server/src/implementation/fs/FileContentStorage';
import FileLibraryStorage from './packages/h5p-server/src/implementation/fs/FileLibraryStorage';
import H5PConfig from './packages/h5p-server/src/implementation/H5PConfig';
import HtmlExporter from './packages/h5p-html-exporter/src/HtmlExporter';

import User from './packages/h5p-html-exporter/test/User';
import InMemoryStorage from './packages/h5p-server/src/implementation/InMemoryStorage';

import scormTemplate from './packages/h5p-html-exporter/test/scorm';
import ContentManager from './packages/h5p-server/src/ContentManager';
import ContentStorer from './packages/h5p-server/src/ContentStorer';
import { LibraryManager } from './packages/h5p-server/src';
import PackageImporter from './packages/h5p-server/src/PackageImporter';

import TemporaryFileManager from './packages/h5p-server/src/TemporaryFileManager';

import { LaissezFairePermissionSystem } from './packages/h5p-server/src/implementation/LaissezFairePermissionSystem';
import DirectoryTemporaryFileStorage from './packages/h5p-server/src/implementation/fs/DirectoryTemporaryFileStorage';
import validateCommitSchema from './packages/h5p-shared-state-server/src/middleware/validateCommitSchema';

class ParameterService {
    async processParameter(parameter: string, parameter2: string): Promise<string> {
        console.log("parameter2:"+parameter2);
      const html = await this.importAndExportHtml(parameter,"externalContentResources", parameter2);
      // Perform any business logic here, e.g., save to database, perform calculations
      return `${html}`;
    }

    public async importAndExportHtml(
      packagePath: string,
      mode: 'singleBundle' | 'externalContentResources',
      filePath: string
  ): Promise<string> {
    let exportedHtml = "inicial";
      await withDir(
          async ({ path: tmpDirPath }) => {
              const contentDir = path.join(tmpDirPath, 'content');
              const libraryDir = path.resolve(`${__dirname}/h5p/libraries`);//"C:\\Users\\piluc\\h5p server\\H5P-Nodejs-library\\packages\\h5p-html-exporter\\test\\h5p\\libraries";//path.join(tmpDirPath, 'libraries');
              await fsExtra.ensureDir(contentDir);
              await fsExtra.ensureDir(libraryDir);
  
              const user = new User();
  
              const contentStorage = new FileContentStorage(contentDir);
              const contentManager = new ContentManager(
                  contentStorage,
                  new LaissezFairePermissionSystem()
              );
              console.log("libraryDir: "+libraryDir);
              const libraryStorage = new FileLibraryStorage(libraryDir);
              const libraryManager = new LibraryManager(libraryStorage);
              const storage = new InMemoryStorage();
              const config = new H5PConfig(storage);
              // const config = new H5PConfig(null);
  
              const tmpManager = new TemporaryFileManager(
                  new DirectoryTemporaryFileStorage(tmpDirPath),
                  config,
                  new LaissezFairePermissionSystem()
              );
  
              const packageImporter = new PackageImporter(
                  libraryManager,
                  config,
                  new LaissezFairePermissionSystem(),
                  contentManager,
                  new ContentStorer(contentManager, libraryManager, tmpManager)
              );
              console.log("HERE 5");
              const htmlExporter = new HtmlExporter(
                  libraryStorage,
                  contentStorage,
                  config,
                  path.resolve(`${__dirname}/h5p/core`),
                  path.resolve(`${__dirname}/h5p/editor`),
                  scormTemplate()
              );
              console.log("HERE 55");
              console.log("filePath: "+filePath);
              const contentId = (
                  await packageImporter.addPackageLibrariesAndContent(
                    filePath,
                      user
                  )
              ).id;
              // console.log("contentId: "+contentId);
            //   const contentId =packagePath;//"C:\\Users\\piluc\\Downloads\\accordion-33";//path.resolve(`${__dirname}/h5p/files/accordion-6-7138.h5p`);//no sirve para nada lo definimos en el h5pplayer a la carpeta unzipped
              if (mode === 'singleBundle') {
                  exportedHtml = await htmlExporter.createSingleBundle(
                      packagePath,
                      user
                  );
                  console.log("HERE 2");
                  // console.log(exportedHtml);
                  // Ensure the directory exists
                  const exportedPath = path.join(path.resolve(`${__dirname}/h5p`),"index.html");
                  console.log(exportedPath);
                  const dir = path.dirname(exportedPath);
                  if (!fs.existsSync(dir)) {
                      fs.mkdirSync(dir, { recursive: true });
                  }
  
                  // Write the content to the file
                  await fs.promises.writeFile(exportedPath, exportedHtml, 'utf8');
                  
                  // await withFile(
                  //     async (result) => {
                  //         await fsExtra.writeFile(result.path, exportedHtml);
                  //         // await page.goto(`file://${result.path}`, {
                  //         //     waitUntil: ['networkidle0', 'load'],
                  //         //     timeout: 30000
                  //         // });
                  //     },
                  //     {
                  //         keep: false,
                  //         postfix: '.html'
                  //     }
                  // );
              }else if(mode === 'externalContentResources') {
                const res =
                await htmlExporter.createBundleWithExternalContentResources(
                    packagePath,
                    user,
                    contentId.toString()
                );
                // const input = 'file://./content/C:/Users/piluc/Downloads/multiple-choice-713/1024301362/images/file-5885c23902f31.jpg file://./content/another/path/images/file-123456789.jpg';

                // // Regular expression to match everything between file:// and the images/filename.jpg
                // const regex = /file:\/\/.*?(\/images\/[^/]+\.(jpg|png|gif|bmp|jpeg))/gi;

                // var html = res.html;
                // // Replace the matched part with the captured group
                // var htmlFixed = html.replace(regex, 'file:/$1');
            await withDir(
                async (result) => {
                    await fsExtra.mkdirp(path.resolve(`${__dirname}/h5p/${contentId}`));
                    // console.log("result.path: "+result.path);
                    await fsExtra.writeFile(
                        path.join(path.resolve(`${__dirname}/h5p/${contentId}`), `${contentId}.html`),
                        res.html
                    );
                    for (const f of res.contentFiles) {
                        try {
                            const tempFilePath = path.join(
                                path.resolve(`${__dirname}/h5p/${contentId}`),
                                f
                            );
                            await fsExtra.mkdirp(
                                path.dirname(tempFilePath)
                            );
                            const writer =
                                fsExtra.createWriteStream(tempFilePath);
                            const readable =
                                await contentStorage.getFileStream(
                                    contentId,
                                    f,
                                    user
                                );
                            await promisePipe(readable, writer);
                            writer.close();
                        } catch {
                            // We silently ignore errors here as there is
                            // some example content with invalid file
                            // references.
                        }
                    }
                    // await page.goto(
                    //     `file://${result.path}/${contentId}.html`,
                    //     {
                    //         waitUntil: ['networkidle0', 'load'],
                    //         timeout: 30000
                    //     }
                    // );
                },
                {
                    keep: false,
                    unsafeCleanup: true
                }
            );
            exportedHtml = res.html;
              }
          },
          { keep: false, unsafeCleanup: true }
  
          
      );

      return exportedHtml;
  }
  }
  
  // Create a singleton instance of the service
  const parameterService = new ParameterService();
  
  // Export the instance to be used in controllers
  export default parameterService;
  