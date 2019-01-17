#!python
# -*- coding: gb2312 -*-

# ����ű�רΪpygame�Ż���ʹ��py2exe����������Դ��distĿ¼
#
# ʹ�����������⣬������������
#  //eyehere.net/2011/python-pygame-novice-professional-py2exe/
#
# ��װ����:
#         python, pygame, py2exe ��Ӧ��װ��

# ʹ�÷���:
#         1: �޸Ĵ��ļ���ָ����Ҫ�����.py�Ͷ�Ӧ����
#         2: python pygame2exe.py
#         3: ��dist�ļ����У�enjoy it~

try:
    from distutils.core import setup
    import py2exe, pygame
    from modulefinder import Module
    import glob, fnmatch
    import sys, os, shutil
    from pygame.locals import *
except ImportError, message:
    raise SystemExit,  "Sorry, you must install py2exe, pygame. %s" % message

# ��������������ж�DLL�Ƿ���ϵͳ�ṩ�ģ��ǵĻ��Ͳ��ô����
origIsSystemDLL = py2exe.build_exe.isSystemDLL
def isSystemDLL(pathname):
    # ��Ҫhackһ�£�freetype��ogg��dll������ϵͳDLL
    if os.path.basename(pathname).lower() in ("libfreetype-6.dll", "libogg-0.dll", "sdl_ttf.dll"):
        return 0
    return origIsSystemDLL(pathname)
# ��Hack���ĺ�������д��ȥ
py2exe.build_exe.isSystemDLL = isSystemDLL

# ����µ���Ҳ��һ��Hack��ʹ��pygame��Ĭ������ᱻ����
class pygame2exe(py2exe.build_exe.py2exe):
    def copy_extensions(self, extensions):
        # ���pygameĬ������
        pygamedir = os.path.split(pygame.base.__file__)[0]
        pygame_default_font = os.path.join(pygamedir, pygame.font.get_default_font())
        # ���뿽���ļ��б�
        extensions.append(Module("pygame.font", pygame_default_font))
        py2exe.build_exe.py2exe.copy_extensions(self, extensions)

# ���������������������Ĳ���
class BuildExe:
    def __init__(self):
        #------------------------------------------------------#
        ##### ����һ���µ���Ϸ������Ҫ�޸�����ĸ������� #####
        #------------------------------------------------------#

        # ��ʼpy�ļ�
        self.script = "aodamiao.py"
        # ��Ϸ��
        self.project_name = "aodamiao"
        # ��Ϸsite
        self.project_url = "about:none"
        # ��Ϸ�汾
        self.project_version = "0.0"
        # ��Ϸ���
        self.license = "MyGames License"
        # ��Ϸ����
        self.author_name = "xiaoxiami"
        # ��ϵ����
        self.author_email = "chuange090@163.com"
        # ��Ϸ��Ȩ
        self.copyright = "Copyright (c) 2015 xiaoxiami."
        # ��Ϸ����
        self.project_description = "MyGames Description"
        # ��Ϸͼ��(None�Ļ�ʹ��pygame��Ĭ��ͼ��)
        self.icon_file = None
        # ������Ҫ�������ļ����ļ���(ͼƬ����Ƶ��)
        self.extra_datas = ["init.png","fish.png","aodamiao_2.png","aodamiao_3.png","mine.png"]
        # ������Ҫ��python����
        self.extra_modules = ["pygame"]
        # ��Ҫ�ų���python��
        self.exclude_modules = []
        # ������Ҫ�ų���dll
        self.exclude_dll = ['']
        # ��Ҫ�����py�ļ�
        self.extra_scripts = []
        # ���Zip�ļ���(None�Ļ��������exe�ļ���)
        self.zipfile_name = None
        # �����ļ���
        self.dist_dir ='dist'

    def opj(self, *args):
        path = os.path.join(*args)
        return os.path.normpath(path)

    def find_data_files(self, srcdir, *wildcards, **kw):
        # ��Դ�ļ����ڻ�ȡ�ļ�
        def walk_helper(arg, dirname, files):
            # ��Ȼ��ʹ�������İ汾���ƹ���ʲô�ģ�Ҳ���Լӽ���
            if '.svn' in dirname:
                return
            names = []
            lst, wildcards = arg
            for wc in wildcards:
                wc_name = self.opj(dirname, wc)
                for f in files:
                    filename = self.opj(dirname, f)

                    if fnmatch.fnmatch(filename, wc_name) and not os.path.isdir(filename):
                        names.append(filename)
            if names:
                lst.append( (dirname, names ) )

        file_list = []
        recursive = kw.get('recursive', True)
        if recursive:
            os.path.walk(srcdir, walk_helper, (file_list, wildcards))
        else:
            walk_helper((file_list, wildcards),
                        srcdir,
                        [os.path.basename(f) for f in glob.glob(self.opj(srcdir, '*'))])
        return file_list

    def run(self):
        if os.path.isdir(self.dist_dir): # ɾ���ϴε����ɽ��
            shutil.rmtree(self.dist_dir)

        # ���Ĭ��ͼ��
        if self.icon_file == None:
            path = os.path.split(pygame.__file__)[0]
            self.icon_file = os.path.join(path, 'pygame.ico')

        # �����Ҫ����������ļ�
        extra_datas = []
        for data in self.extra_datas:
            if os.path.isdir(data):
                extra_datas.extend(self.find_data_files(data, '*'))
            else:
                extra_datas.append(('.', [data]))

        # ��ʼ���exe
        setup(
            cmdclass = {'py2exe': pygame2exe},
            version = self.project_version,
            description = self.project_description,
            name = self.project_name,
            url = self.project_url,
            author = self.author_name,
            author_email = self.author_email,
            license = self.license,

            # Ĭ�����ɴ��ڳ��������Ҫ�����ն˳���(debug�׶�)��ʹ�ã�
            # console = [{
            windows = [{
                'script': self.script,
                'icon_resources': [(0, self.icon_file)],
                'copyright': self.copyright
            }],
            options = {'py2exe': {'optimize': 2, 'bundle_files': 1,
                                  'compressed': True,
                                  'excludes': self.exclude_modules,
                                  'packages': self.extra_modules,
                                  'dist_dir': self.dist_dir,
                                  'dll_excludes': self.exclude_dll,
                                  'includes': self.extra_scripts} },
            zipfile = self.zipfile_name,
            data_files = extra_datas,
            )

        if os.path.isdir('build'): # ���build�ļ���
            shutil.rmtree('build')

if __name__ == '__main__':
    if len(sys.argv) < 2:
        sys.argv.append('py2exe')
    BuildExe().run()
    raw_input("Finished! Press any key to exit.")
