
import os
import json
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import datetime
from matplotlib.ticker import AutoMinorLocator
from collections import Counter
from urllib.parse import urlparse

def make_autopct(sizes):
    def my_autopct(pct):
        total = sum(sizes)
        val = int(round(pct*total/100.0))
        return '{v:d} ({p:.0f}%)'.format(p=pct,v=val)
    return my_autopct

def func(parent_path, username, dirname):
    #Сохранение всех профильных имен из названий
    #parent_path = 'C:\\Users\\Воевода\\Desktop\\Hak'

    #parent_path = '/home/operator3/Документы/hack-huyak/scripts'
    ##должны быть подпапки analysis и users внутри
    print('parent path', parent_path)
    print('username', username)
    directory = parent_path + '/' + dirname


    #names_profile = os.listdir(directory) #все юзеры
    names_profile = [username]

    #print('Количество профилей:', len(names_profile))
    #names_profile

    k = 0
    if (os.path.isdir(parent_path + '/analysis/' + str(username))):
        print('srazuvse')
        return
    print('29')
    for name_profile in names_profile: # Считываем поочеердно каждый профиль
        info_logs = []
        
        #Создаем папку с профилем для сбора данных
        dir0 = parent_path + '/analysis/' + str(name_profile)
        if not os.path.isdir(dir0):
            os.mkdir(dir0)
            
        k+=1
        print('Идет работы с', k, 'пользователем.')
        
        with open(directory + '/' + str(name_profile)) as json_file: #Считываение JSON формата 
            data = json.load(json_file) 
            
            #Сбор данных по всей его активности
            for i in range(0, len(data)):
                strk = data[i]['time']
                urls = data[i]['url']
                url = (urlparse(urls).netloc).replace('www.','')
                info_logs.append([name_profile, strk[0:4], strk[5:7], strk[8:10], strk[11:13], strk[14:16], strk[17:19], url])
            
            df_logs = pd.DataFrame(info_logs, columns= ['name', 'year', 'month', 'day', 'hour', 'minute', 'second', 'url'])
            dir_save = parent_path + '/analysis/' + str(name_profile) + '/logs.xlsx'
            df_logs.to_excel(dir_save) #Засейвить logs.xlsx
            
            #Выделение топа доменов для пользователя
            cf = Counter(df_logs['url'].tolist()).most_common()
            df_url_count = pd.DataFrame(cf, columns= ['url', 'count'])
            dir_save_url_count = parent_path + '/analysis/' + str(name_profile) + '/top_domain.xlsx'
            df_url_count.to_excel(dir_save_url_count) #SAVE
            
    print('Программа завершила работу!')


    k2 = 0
    for name_profile in names_profile:
        k2+=1
        print('Идет работы с', k2, 'пользователем.')
        
        dir_names = parent_path + '/analysis/' + name_profile + '/logs.xlsx'
        
        df_times = pd.read_excel(dir_names)
        activ_hours = Counter(df_times['hour']).most_common()
        df_activ_hours = pd.DataFrame(activ_hours, columns= ['hour', 'count'])
        
        dir_save = parent_path + '/analysis/' + name_profile + '/activ_in_hours.xlsx'
        df_activ_hours.to_excel(dir_save) #SAVE
        
    print('Программа завершила работу!')

    #Создание графиков почасовой активности

    #names_profile = ['006daf94-257e-3c15-097f-b1ecc26c8dab']

    k3 = 0
    for name_profile in names_profile:
        k3+=1
        print('Идет работы с', k3, 'пользователем.')
        
        dir_open = parent_path + '/analysis/' + name_profile + '/activ_in_hours.xlsx'
        df_gtimes = pd.read_excel(dir_open)
        df_gtimes = df_gtimes.sort_values(by='hour')
        
        fig, ax = plt.subplots(figsize=(12, 6))
        ax.grid(which="major", linewidth=0.22, color='#B0C4DE', linestyle="--")
        ax.bar(df_gtimes['hour'], df_gtimes['count'],  color = '#0000CD') 
        plt.xlim([0, 24])   
        plt.title('Диаграмма почасовой активности пользователя: ' + str(name_profile) + '\n', fontsize=15)
        plt.xlabel('Часы', fontsize=15, color='black')
        plt.ylabel('Количество запросов', fontsize=15, color='black')
        plt.xticks(np.arange(0, 24, 1.0))
        ax.yaxis.set_minor_locator(AutoMinorLocator())
        ax.tick_params(which='minor', length=5, width=1, color='#B0C4DE')
        #plt.show()
        
        dir_save_d = parent_path + '/analysis/' + name_profile + '/Activity_diagram.jpg'
        fig.savefig(dir_save_d) #SAVE
        
    print('Программа завершила работу!')

    #Создание графиков топ доменов
    k4 = 0

    #names_profile = ['006daf94-257e-3c15-097f-b1ecc26c8dab']

    for name_profile in names_profile:
        tdomain = []
        tcount = []
        
        k4+=1
        #print('Идет работы с', k4, 'пользователем: ' + str(name_profile))
        
        dir_open = parent_path + '/analysis/' + name_profile + '/top_domain.xlsx'
        df_topd = pd.read_excel(dir_open)
        
        kl = len(df_topd)
        
        if kl > 10:
            kt = 10
        else:
            kt = kl
        
        for i in range(kt):
            tdomain.append(df_topd['url'][i])
            tcount.append(df_topd['count'][i])
        if kt==10:
            tdomain.append('Остальные')
            tcount.append(sum(df_topd['count']) - sum(tcount))

        
        fig1, ax1 = plt.subplots(figsize=(14, 6))
        plt.title('Часто посещаемые домены пользователя: '+ str(name_profile) + '\n\n')

        labels = tdomain
        sizes = tcount
        colors = ['#00008B','#0000CD', '#0038E2','#0055D4', '#0071C6','#008DB8','#00AAAA','#00C69C','#00E28E','#00FF80','#00FF00', '#ADFF2F','#5F9EA0']
        
        explodez = [0.05, 0, 0.1, 0.15, 0.3, 0.5, 0.7, 0.9, 1.1, 1.29, 0.7] 
        explodes = explodez [0:len(tdomain)]
        #print('explodes = ', explodes, 'всего:', len(explodes))
        
        ax1.pie(sizes, autopct='%1.1f%%', colors=colors, radius = 1, shadow=True, wedgeprops={'lw':1, 'ls':'--','edgecolor':"k"}, rotatelabels=True, labeldistance = None, explode=explodes, pctdistance = 1.25)
        ax1.axis("equal")
        ax1.legend(labels=labels, loc='best')
        
        dir_save_d = parent_path + '/analysis/' + name_profile + '/Top_domains.jpg'
        fig1.savefig(dir_save_d)

        ################
    kl = 0
#names_profile = ['03932c52-6159-131d-264d-c8f7275c5bdc']

    for name_profile in names_profile:
        dir_log = parent_path + '/analysis/' + str(name_profile) + '/logs.xlsx'
        #print(dir_log)
        df_logs = pd.read_excel(dir_log)
        
        ndays = []
        kl+=1
        print('Идет работа с ' + str(kl) +' пользователем ' + str(name_profile))
        
        for i in range(0, len(df_logs)):
            s = int(datetime.date(int(df_logs['year'][i]), int(df_logs['month'][i]), int(df_logs['day'][i]) ).weekday())+1
            ndays.append(s)
            
        try:
            df_logs.drop(['Day_week'], axis = 1, inplace = True)
        except:
            pass
        
        df_logs.drop(df_logs.columns[[0]], axis = 1, inplace = True)
        df_logs['Day_week'] = ndays

        df_logs.to_excel(dir_log)

    kl1 = 0
    for name_profile in names_profile:
        dir_log = parent_path + '/analysis/' + str(name_profile) + '/logs.xlsx'
        df_logs = pd.read_excel(dir_log)
        
        ndays = []
        kl1+=1
        print('Идет работа с ' + str(kl1) +' пользователем ' + str(name_profile))
        
        d1 = len(df_logs[df_logs['Day_week'] == 1]) 
        d2 = len(df_logs[df_logs['Day_week'] == 2])
        d3 = len(df_logs[df_logs['Day_week'] == 3])
        d4 = len(df_logs[df_logs['Day_week'] == 4])
        d5 = len(df_logs[df_logs['Day_week'] == 5])
        d6 = len(df_logs[df_logs['Day_week'] == 6])
        d7 = len(df_logs[df_logs['Day_week'] == 7])

        name_d = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
        d = [d1, d2, d3, d4, d5, d6, d7]

        fig, ax = plt.subplots(figsize=(12, 6))
        ax.bar(name_d, d, color = '#0000CD') 
        plt.xlim([-0.5, 6.5])   
        plt.title('Диаграмма недельной активности пользователя: ' + str(name_profile) + '\n', fontsize=15)
        #plt.xlabel('Неделя', fontsize=15, color='black')
        plt.ylabel('Количество запросов', fontsize=15, color='black')
        plt.xticks(np.arange(0, 7, 1.0),  fontsize=13)
        plt.yticks(fontsize=12)
        ax.yaxis.set_minor_locator(AutoMinorLocator())
        ax.tick_params(which='minor', length=5, width=1, color='#B0C4DE')
        ax.grid(which="major", linewidth=0.35, color='#A9A9A9', linestyle="--")
        ax.grid(which="minor", linewidth=0.2, color='#C0C0C0', linestyle="--")
        #plt.show()
        
        dir_save_d = parent_path + '/analysis/' + name_profile + '/Weekly_activity.jpg'
        fig.savefig(dir_save_d)
        

    kll = 0

    for name_profile in names_profile:
        dir_log = parent_path + '/analysis/' + str(name_profile) + '/logs.xlsx'
        df_logs = pd.read_excel(dir_log)

        kll+=1
        print('Идет работа с ' + str(kll) +' пользователем ' + str(name_profile))
        
        for ii in range(1,8):
            
            df_logs_1 = df_logs[df_logs['Day_week'] ==  int(ii)]

            cf = Counter(df_logs_1['url'].tolist()).most_common()
            df_url_count = pd.DataFrame(cf, columns= ['url', 'count'])
            
            dir_save_top_week = parent_path + '/analysis/' + str(name_profile) + '/top_domain_week_' +str(ii)+ '.xlsx'
            df_url_count.to_excel(dir_save_top_week) #SAVE
    
    # Отрисовка графика активности по дневная
    kk4 = 0
    name_d = ['понедельник', 'вторник', 'среду', 'четверг', 'пятницу', 'субботу', 'воскресенье']

    #names_profile = ['006daf94-257e-3c15-097f-b1ecc26c8dab']



    for name_profile in names_profile:
        
        kk4+=1
        print('Идет работы с', kk4, 'пользователем: ' + str(name_profile))
        
        for ii in range(1,8):
            tdomain = []
            tcount = []
            
            dir_open = parent_path + '/analysis/' + name_profile + '/top_domain_week_' +str(ii)+ '.xlsx'
            df_topd = pd.read_excel(dir_open)

            kl = len(df_topd)
            if kl>0:
                if kl > 10:
                    kt = 10
                else:
                    kt = kl

                for i in range(kt):
                    tdomain.append(df_topd['url'][i])
                    tcount.append(df_topd['count'][i])
                if kt==10:
                    tdomain.append('Остальные')
                    tcount.append(sum(df_topd['count']) - sum(tcount))


                fig1, ax1 = plt.subplots(figsize=(14, 6))

                plt.title('Часто посещаемые домены в '+ str(name_d[ii-1]) +': '+ str(name_profile) + '\n\n')

                labels = tdomain
                sizes = tcount
                colors = ['#00008B','#0000CD', '#0038E2','#0055D4', '#0071C6','#008DB8','#00AAAA','#00C69C','#00E28E','#00FF80','#00FF00', '#ADFF2F','#5F9EA0']

                explodez = [0.05, 0, 0.1, 0.15, 0.3, 0.5, 0.7, 0.9, 1.1, 1.29, 0.7] 
                explodes = explodez [0:len(tdomain)]
                #print('explodes = ', explodes, 'всего:', len(explodes))

                ax1.pie(sizes, autopct=make_autopct(sizes), colors=colors, radius = 1, shadow=True, wedgeprops={'lw':1, 'ls':'--','edgecolor':"k"}, rotatelabels=True, labeldistance = None, explode=explodes, pctdistance = 1.25)
                ax1.axis("equal")
                ax1.legend(labels=labels, loc='best')
                #plt.show()

                dir_save_g = parent_path + '/analysis/' + name_profile + '/Top_domains_week_' +str(ii)+ '.jpg'
                fig1.savefig(dir_save_g)
            else:
                pass
               
        print('vse')
        #plt.show()


if __name__ == "__main__":
    try:
        print('start')
        import argparse

        parser = argparse.ArgumentParser()

        parser.add_argument("f1") #parent path
        parser.add_argument("f2") #user name
        parser.add_argument("f3") #dir name
        args = parser.parse_args()
        
        print('before func')
        func(args.f1, args.f2, args.f3)
    except Exception as e:
        print('fall')
        print('exp', str(e))

