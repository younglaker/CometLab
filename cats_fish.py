# -*-coding:utf-8-*- s = '
# 从天上会随机的掉下鱼，你需要使用鼠标操纵猫去接住鱼，丢失一条鱼损失一条命，一共有10条命，同时还要避免接到炸弹。接住鱼会有积分。



import sys, random, time, pygame
from pygame.locals import *


# 输出文字函数
def print_text(font, x, y, text, color=(255, 255, 255)):
    # ZiTiDuiXiang = pygame.font.SysFont('SimHei', 32)
    imgText = font.render(text, True, color)
    screen.blit(imgText, (x, y))


# 炮弹
class Bullet:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.pic = pygame.image.load("pao.png")

    def draw(self):
        # 速度为2
        self.y = self.y - 2


# 爱心
class Heart:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.pic = pygame.image.load("heart.png")

    def draw(self):
        # 速度为3
        self.y = self.y + 3



# 全局变量设置
pygame.init()
screen = pygame.display.set_mode((600, 500))
pygame.display.set_caption("小猫抓鱼")

# 字体大小的变量
font1 = pygame.font.SysFont('Heiti SC', 24)
font2 = pygame.font.SysFont('Heiti SC', 18)
font3 = pygame.font.SysFont('Heiti SC', 34)

# pygame.mouse.set_visible(False)

# 颜色值变量
white = 255, 255, 255
red = 220, 50, 50
yellow = 230, 230, 50
black = 0, 0, 0

# 游戏对象的变量
cat = pygame.image.load("aodamiao_2.png")
width, height = cat.get_size()
# pic=pygame.transform.smoothscale(cat,(width//2,height//2))
pic = pygame.transform.scale(cat, (width, height))

# 红鲤鱼
fish = pygame.image.load("fish.png")
width, height = fish.get_size()
fish = pygame.transform.smoothscale(fish, (width // 3, height // 3))

# 绿鲤鱼
fish2 = pygame.image.load("fish_green.png")
width, height = fish2.get_size()
fish2 = pygame.transform.smoothscale(fish2, (width // 3, height // 3))

# 界面
init = pygame.image.load("init.png")
win = pygame.image.load("win.png")
lose = pygame.image.load("lose.png")


lives = 10
score = 0
clock_start = 0
# game_over: 1-显示开始页，2-显示通关页，3-显示失败页
game_over = 1
mouse_x = mouse_y = 0
Round = 1
mine = 0
donkey_png = pygame.image.load("donkey.png")
# 猫在接到炸弹。或者生命值小于5的时候，会变成哭脸，因此我们还需要加载一张哭脸的位图
cat2 = pygame.image.load("aodamiao_3.png")
flag = 0

pos_x = 300
pos_y = 410 - 40

bomb_x = random.randint(0, 500)
bomb_x2 = random.randint(0, 500)
bomb_y = -50
bomb_y2 = -230
# 鱼的速度
vel_y = 3
# 驴的速度
vel_yy = 3
mine_y = -100
mine_x = random.randint(0, 500)

# 爆炸效果图
bomb_pic = pygame.image.load("bomb.png")

bullet = False
heart = Heart(random.randint(0, 500), -150)

start = True


# 游戏循环
while True:

    # 再按 s 键 恢复游戏
    for event in pygame.event.get():
        if event.type == KEYUP:
            if event.key == pygame.K_s:
                start = True
    # print(start)
    # print('===')

    while start:
        for event in pygame.event.get():
            if event.type == QUIT:
                sys.exit()

            # 检测鼠标移动事件，更新鼠标变量的数据
            elif event.type == MOUSEMOTION:
                mouse_x, mouse_y = event.pos
                move_x, move_y = event.rel

            # 当鼠标 up 的时候，检测是否是游戏结束状态
            # 如果是游戏结束状态，就重置数据，重新开始游戏
            elif event.type == MOUSEBUTTONUP:
                if game_over == 1:
                    game_over = 0
                    lives = 10
                    score = 0
                    Round = 1
                    vel_y = 3
                    mine = 0
                    flag = 0
                    pic = cat

            # 检测键盘事件
            elif event.type == KEYUP:
                # 按 s 键暂停游戏
                if event.key == pygame.K_s:
                    start = False

                # 发射跑炮弹
                if event.key == pygame.K_SPACE:
                    bullet =  Bullet(pos_x + 15, pos_y)

        # 退出游戏
        keys = pygame.key.get_pressed()

        if keys[K_ESCAPE]:
            sys.exit()

        # 画黑色的游戏背景
        screen.fill( black)

        # 游戏结束，显示主页
        if game_over ==  1:
            screen.blit(init, (30, 60))
            # print_text(font3, 200, 400, "点击开始")
            # print_text(font2, 90, 480, "小组成员：李宵汉、黄绮、邹晓旭、刘严璟、徐佩文")
        elif game_over == 2:
            print_text(font1, 250, 60, "分数为" + str(score))
            screen.blit(win, (100, 100))
        elif game_over == 3:
            print_text(font1, 250, 60, "分数为" + str(score))
            screen.blit(lose, (100, 100))
        # 开始游戏
        else:
            # 开始
            if score > 10 and score < 60:
                Round = 2
            elif score > 60 and score < 90:
                Round = 3
            elif score > 90 and score < 120:
                Round = 4
            elif score > 120 and score < 150:
                Round = 5
            elif score >= 150:
                # Round = 6
                game_over = 2
            # 显示难度值
            print_text(font1, 280, 0, "难度: " + str(Round))
            # 设置速度
            if Round == 1:
                vel_y = 3
            elif Round == 2:
                vel_y = 4
            elif Round == 3:
                vel_y = 5
            elif Round == 4:
                vel_y = 6
            elif Round == 5:
                vel_y = 7
            # mine number setting
            # mine=random.randint(1,9)
            # 移动鱼
            bomb_y += vel_y
            bomb_y2 += vel_y
            mine_y += vel_yy

            screen.blit(bomb_pic, (-100, -100))

            # 如果错过鱼的话，就重置鱼的位置，给它一个随机的x值，然后生命值减一
            if bomb_y > 500:
                bomb_x = random.randint(0, 500)
                bomb_y = -50
                lives -= 1
                if lives == 0:
                    game_over = 3
            # 检查玩家是否接到了红鱼
            # 碰撞检测函数，查看是否接住鱼
            elif bomb_y > pos_y:
                # 接到鱼
                if bomb_x > pos_x - 10 and bomb_x < pos_x + 70:
                    score += 10
                    bomb_x = random.randint(0, 500)
                    bomb_y = -50
                    pic = cat

            # 绿鲤鱼
            # 如果错过鱼的话，就重置鱼的位置，给它一个随机的x值，然后生命值减一
            if bomb_y2 > 500:
                bomb_x2 = random.randint(0, 500)
                bomb_y2 = -230
                lives -= 1
                if lives == 0:
                    game_over = 3
            # 检查玩家是否接到了绿鱼
            elif bomb_y2 > pos_y:
                # 接到鱼
                if bomb_x2 > pos_x - 10 and bomb_x2 < pos_x + 70:
                    score += 10
                    bomb_x2 = random.randint(0, 500)
                    bomb_y2 = -230
                    pic = cat

            if Round > 2:
                # 玩家是否躲避了驴
                if mine_y > 500:
                    mine_x = random.randint(0, 500)
                    mine_y = -50
                # 检查玩家是否接到了驴
                # 当接到炸弹的时候，猫变成哭脸
                elif mine_y > pos_y:
                    if mine_x > pos_x and mine_x < pos_x + 40:
                        mine_x = random.randint(0, 500)
                        mine_y = -50
                        lives -= 1
                        pic = cat2
                        if lives == 0:
                            game_over = 3

                if bullet:
                    # 打中驴，把驴和子弹清空（移到屏幕外）
                    if mine_x-100 < bullet.x < mine_x+100 and bullet.y <= mine_y:
                        # print('dazhong')
                        screen.blit(bomb_pic, (bullet.x , int(bullet.y)))
                        score += 10
                        bullet.y = -100
                        mine_y= 550

                # heart的位置再游戏区域内进行检测
                if heart.y < 500:
                    # 当猫咪的坐标在爱心的坐标上下50px 范围内，且爱心纵坐标大于小猫纵坐标
                    # 则表示接住爱心，加一个生命值
                    # 再把爱心位置设置为-150，因为等待下一次更新
                    if heart.x -50 < pos_x < heart.x+50 and heart.y > pos_y:
                        # print('jiezhu')
                        lives += 1
                        heart.x = random.randint(0, 500)
                        heart.y = -150

            # 当生命值小于8时，出现爱心补充生命值
            # 只有生命值小于8的时候，才执行draw()更新
            if lives < 8 :
                # 设置1000，让爱心的出现有个时间间隔
                if heart.y > 1000:
                    heart.x = random.randint(0, 500)
                    heart.y = -100
                heart.draw()
                screen.blit(heart.pic, (heart.x, heart.y))

            # 画鱼
            screen.blit(fish, (bomb_x, int(bomb_y)))
            screen.blit(fish2, (bomb_x2, int(bomb_y2)))
            # 画驴
            if Round > 2:
                screen.blit(donkey_png, (mine_x, int(mine_y)))

            # 设置猫的位置
            pos_x = mouse_x
            if pos_x < 0:
                pos_x = 0
            elif pos_x > 510:
                pos_x = 500
            # 当猫的生命值小于5时，猫变成哭脸
            if lives < 5:
                pic = cat2
            screen.blit(pic, (pos_x, pos_y))

            if bullet:
                screen.blit(bullet.pic, (bullet.x, bullet.y))
                bullet.draw()

        # 打印生命值
        print_text(font1, 0, 0, "生命值: " + str(lives))

        # 打印分数
        print_text(font1, 500, 0, "得分: " + str(score))

        # 页面更新
        pygame.display.update()





