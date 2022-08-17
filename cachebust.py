import os
import hashlib
import shutil

clean = True

if clean:
    folder = './deploy/'
    for filename in os.listdir(folder):
        file_path = os.path.join(folder, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print('Failed to delete %s. Reason: %s' % (file_path, e))
    if not os.path.exists('./deploy/admin-pages'):
        os.mkdir('./deploy/admin-pages')
    if not os.path.exists('./deploy/css'):
        os.mkdir('./deploy/css')
    if not os.path.exists('./deploy/img'):
        os.mkdir('./deploy/img')
    if not os.path.exists('./deploy/include'):
        os.mkdir('./deploy/include')
    if not os.path.exists('./deploy/js'):
        os.mkdir('./deploy/js')

hashSize = 9

#read file and add hash
def hashFile(fldr, file, number):
    hasher = hashlib.md5()
    fileHash = '';
    ext = '';
    newFldr = '';
    with open(fldr + file, 'rb') as afile:
        buf = afile.read()
        hasher.update(buf)
        fileHash = hasher.hexdigest()[0:number]
    if file[-3:] == '.js':
        ext = '.js'
        newFldr = r'./deploy/js/'
    if file[-4:] == '.css':
        ext = '.css'
        newFldr = r'./deploy/css/'
    newFilenames.append(newFldr[9:] + file[0:-2] + fileHash + ext)
    shutil.copyfile(fldr + file, newFldr + file[0:-2] + fileHash + ext)

def getFiles(fldr):
    curFldr = os.listdir(fldr);
    for file in curFldr:
        if file[0:1] != '.':
                filenames.append(fldr[2:] + file[0:])
                hashFile(fldr, file, hashSize)
 
# specify your path of directory
jsDir = r"./scripts/"
cssDir = r"./styles/"
baseDir = r"./"
adminPages = r"./admin-pages/"
imgDir = r"./img/"
includeDir = r"./include/"
filenames = []
newFilenames = []
 
# call listdir() method
# path is a directory of which you want to list
directoriesList = [jsDir, cssDir]
 
# This would print all the files and directories
for directory in directoriesList:
    getFiles(directory)

for file in os.listdir(baseDir):
    if file[0:6] == 'proto-':
        with open('./' + file, mode='r') as in_file, open('./deploy/' + file, mode='w') as out_file:
            for line in in_file:
                newLine = str(line)
                for x in range(len(filenames)):
                    if newLine.find(filenames[x]) >=0:
                        newLine = str(line).replace(filenames[x], newFilenames[x])
                out_file.write(f'{newLine}')
    if file[-4:] == '.php':
        if file != 'admin.php':
            shutil.copyfile('./' + file, './deploy/' + file)

for file in os.listdir(adminPages):
    shutil.copyfile(adminPages + file, './deploy/' + adminPages + file)

for file in os.listdir(imgDir):
    shutil.copyfile(imgDir + file, './deploy/' + imgDir + file)

for file in os.listdir(includeDir):
    if file != 'db.php':
        shutil.copyfile(includeDir + file, './deploy/' + includeDir + file)