import os
import json
import pandas as pd
import jsonlines
import pinyin


def clearMarkers(df):
    df[['images', 'panorama', 'position']] = df[[
        'images', 'panorama', 'position']].fillna(0).astype('int')
    df.fillna('', inplace=True)

    # location
    df['latitude'] = df.apply(lambda x: x.location.split(',')[0], axis=1)
    df['longitude'] = df.apply(lambda x: x.location.split(',')[1], axis=1)

    # contact
    df['contact'] = df.apply(lambda x: {
        'phone': x.phone,
        'address': x.address
    }, axis=1)

    # video
    df['video'] = df.apply(lambda x: {
        'src': x.video,
        'owner': x.owner
    }, axis=1)

    df.drop(['phone', 'address', 'location', 'owner'], axis=1, inplace=True)

    data = [{'type': t, 'icon': get_pinyin_first_alpha(
        t), 'data': []} for t in set(df.type)]
    for index, row in df.iterrows():
        for i in data:
            if i['type'] == row.type:
                i['data'].append(dict(row))
                if row.scale != '':
                    i['scale'] = i['data'][0]['scale']
                if row.position != '':
                    i['position'] = i['data'][0]['position']
                if row._id != '':
                    i['_id'] = i['data'][0]['_id']

    with jsonlines.open('data.json', mode='w') as writer:
        for i in data:
            writer.write(i)


def get_pinyin_first_alpha(name):
    return "".join([i[0] for i in pinyin.get(name, " ").split(" ")])


def clearBoard(df):
    df = df[df.status != 1]
    df = df.drop(columns='status')
    data = [{'type': t, 'data': []} for t in set(df.type)]
    for item in data:
        for index, row in df.iterrows():
            if row.type == item['type']:
                item['data'].append(dict(row))

    with jsonlines.open('data_board.json', mode='w') as writer:
        for i in data:
            writer.write(i)


if __name__ == "__main__":
    os.chdir(os.path.join(os.getcwd(), 'data'))
    df = pd.read_excel('markers.xlsx')
    df_board = pd.read_excel('board.xlsx')
    clearMarkers(df)
    clearBoard(df_board)

    # print('👌')
