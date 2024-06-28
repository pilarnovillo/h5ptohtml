import puppeteer from 'puppeteer';
import * as fsExtra from 'fs-extra';
import * as fs from 'fs';
import * as path from 'path';
import { withDir, withFile } from 'tmp-promise';
// import promisePipe from 'promisepipe';

import ContentManager from '../../h5p-server/src/ContentManager';
import ContentStorer from '../../h5p-server/src/ContentStorer';
import FileContentStorage from '../../h5p-server/src/implementation/fs/FileContentStorage';
import FileLibraryStorage from '../../h5p-server/src/implementation/fs/FileLibraryStorage';
import H5PConfig from '../../h5p-server/src/implementation/H5PConfig';
import LibraryManager from '../../h5p-server/src/LibraryManager';
import PackageImporter from '../../h5p-server/src/PackageImporter';
import HtmlExporter from '../src/HtmlExporter';

import scormTemplate from './scorm';
// import { LaissezFairePermissionSystem } from '../../h5p-server';


import User from './User';
import { LaissezFairePermissionSystem } from '../../h5p-server/src';
import InMemoryStorage from '../../h5p-server/src/implementation/InMemoryStorage';
import TemporaryFileManager from '../../h5p-server/src/TemporaryFileManager';
import DirectoryTemporaryFileStorage from '../../h5p-server/src/implementation/fs/DirectoryTemporaryFileStorage';


let browser: puppeteer.Browser;
let page: puppeteer.Page;


async function importAndExportHtml(
    packagePath: string,
    mode: 'singleBundle' | 'externalContentResources'
): Promise<void> {
    await withDir(
        async ({ path: tmpDirPath }) => {
            const contentDir = path.join(tmpDirPath, 'content');
            const libraryDir = "C:\\Users\\piluc\\h5p server\\H5P-Nodejs-library\\packages\\h5p-html-exporter\\test\\h5p\\libraries";//path.join(tmpDirPath, 'libraries');
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
            const contentId = (
                await packageImporter.addPackageLibrariesAndContent(
                    packagePath,
                    user
                )
            ).id;
            // console.log("contentId: "+contentId);
            // const contentId =packagePath;//"C:\\Users\\piluc\\Downloads\\accordion-33";//path.resolve(`${__dirname}/h5p/files/accordion-6-7138.h5p`);//no sirve para nada lo definimos en el h5pplayer a la carpeta unzipped
            if (mode === 'singleBundle') {
                const exportedHtml = await htmlExporter.createSingleBundle(
                    contentId,
                    user
                );
                console.log("HERE 2");
                // console.log(exportedHtml);
                // Ensure the directory exists
                const dir = path.dirname("C:\\Users\\piluc\\h5p server\\H5P-Nodejs-library\\packages\\h5p-html-exporter\\test\\h5p\\example.html");
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }

                // Write the content to the file
                await fs.promises.writeFile("C:\\Users\\piluc\\h5p server\\H5P-Nodejs-library\\packages\\h5p-html-exporter\\test\\h5p\\example.html", exportedHtml, 'utf8');
                
                await withFile(
                    async (result) => {
                        await fsExtra.writeFile(result.path, exportedHtml);
                        // await page.goto(`file://${result.path}`, {
                        //     waitUntil: ['networkidle0', 'load'],
                        //     timeout: 30000
                        // });
                    },
                    {
                        keep: false,
                        postfix: '.html'
                    }
                );
            } 
        },
        { keep: false, unsafeCleanup: true }

        
    );
}


    importAndExportHtml(
        "C:\\Users\\piluc\\h5p server\\H5P-Nodejs-library\\packages\\h5p-html-exporter\\test\\h5p\\files\\arithmetic-quiz-22-57860.h5p",
        'singleBundle'
    );
    

