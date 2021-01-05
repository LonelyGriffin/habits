import {Yadisk} from './yadisk'
import {inject, injectable} from 'inversify'
import {AppResult, AppResultError} from '../../value/result'
import axios from 'axios'
import {RootDIType} from '../../dependencyInjection/rootType'
import {DiaryNoteRepository} from '../../repository/diaryNote/diaryNoteRepository'
import moment from 'moment'

@injectable()
export class AppYadisk implements Yadisk {
  private token: string | null = localStorage.getItem('token')
  constructor(@inject(RootDIType.DiaryNoteRepository) private diaryNoteRepository: DiaryNoteRepository) {}
  async setToken(token: string) {
    this.token = token
    localStorage.setItem('token', token)
    return new AppResult()
  }
  hasToken() {
    return Boolean(this.token)
  }
  async sync() {
    if (!this.token) {
      return new AppResultError('Not auth yandex')
    }

    try {
      await axios.get('https://cloud-api.yandex.net/v1/disk/resources?path=app:/solid_storage.json', {
        headers: {
          Accept: 'application/json',
          Authorization: `OAuth ${this.token}`
        }
      })
    } catch (e) {
      if (e.response?.data?.error === 'DiskNotFoundError') {
        console.log('to')
        const uploadUrl = await axios.get(
          'https://cloud-api.yandex.net/v1/disk/resources/upload?overwrite=true&path=app:/solid_storage.json',
          {
            headers: {
              Accept: 'application/json',
              Authorization: `OAuth ${this.token}`
            }
          }
        )

        const all = await this.diaryNoteRepository.all()
        console.log(
          all,
          JSON.stringify({
            diaryNotes: all.unwrap()
          })
        )
        await axios.put(
          uploadUrl.data.href,
          JSON.stringify({
            diaryNotes: all.unwrap()
          })
        )
      } else {
        return new AppResultError('Sync failed')
      }
    }

    const meta = await axios.get('https://cloud-api.yandex.net/v1/disk/resources?path=app:/solid_storage.json', {
      headers: {
        Accept: 'application/json',
        Authorization: `OAuth ${this.token}`
      }
    })

    if (!meta?.data?.modified) {
      return new AppResultError('Sync failed')
    }

    const localTimestamp = localStorage.getItem('timestamp') ? moment(localStorage.getItem('timestamp')) : undefined
    const remoteTimestamp = moment(meta?.data?.modified)

    if (!localTimestamp || localTimestamp.isBefore(remoteTimestamp)) {
      console.log('from')
      const downloadResponse = await axios.get(
        'https://cloud-api.yandex.net/v1/disk/resources/download?path=app:/solid_storage.json',
        {
          headers: {
            Accept: 'application/json',
            Authorization: `OAuth ${this.token}`
          }
        }
      )

      if (!meta?.data?.file) {
        return new AppResultError('Sync failed')
      }

      const response = await axios.get(meta?.data?.file)

      const data = response.data

      this.diaryNoteRepository.resetAll(data.diaryNotes.map((x: any) => ({...x, date: moment(x.date)})))

      localStorage.setItem('timestamp', remoteTimestamp.toISOString())
    } else {
      console.log('to')
      const uploadUrl = await axios.get(
        'https://cloud-api.yandex.net/v1/disk/resources/upload?overwrite=true&path=app:/solid_storage.json',
        {
          headers: {
            Accept: 'application/json',
            Authorization: `OAuth ${this.token}`
          }
        }
      )

      const all = await this.diaryNoteRepository.all()
      await axios.put(
        uploadUrl.data.href,
        JSON.stringify({
          diaryNotes: all.unwrap()
        })
      )
      localStorage.setItem('timestamp', moment().toISOString())
    }

    return new AppResult()
  }
}

// https://downloader.disk.yandex.ru/disk/d319a054264a86b2c6edaf86abd634443cf89d12ee4f7292b5d79872b705da7c/5ff450b5/n8cCt5K--tPekjAr9qgsFz0xllLzyYpNe5gjedHtPHaQQu4VJmTtFoneTq9-UkiDLBjPgx7qmvO76t8jpJuanA%3D%3D?uid=174169485&filename=solid_storage.json&disposition=attachment&hash=&limit=0&content_type=text%2Fplain&owner_uid=174169485&fsize=91&hid=c8adafc8c7c5e70da81e1635eefc4b49&media_type=text&tknv=v2&etag=32f7432eca8fbc3fb73393acb9e51764
// https://downloader.disk.yandex.ru/disk/628f87f295e30822f583bb53ac3727179b76611ace0740387d4fa80f5c7ec88f/5ff450b6/n8cCt5K--tPekjAr9qgsFz0xllLzyYpNe5gjedHtPHaQQu4VJmTtFoneTq9-UkiDLBjPgx7qmvO76t8jpJuanA%3D%3D?uid=174169485&filename=solid_storage.json&disposition=attachment&hash=&limit=0&content_type=text%2Fplain&owner_uid=174169485&fsize=91&hid=c8adafc8c7c5e70da81e1635eefc4b49&media_type=text&tknv=v2&etag=32f7432eca8fbc3fb73393acb9e51764
// https://downloader.disk.yandex.ru/disk/6c5b7d9b9482543fd52d708622ad0db7a4396af22c082da2e33a1efe3039365b/5ff4518c/n8cCt5K--tPekjAr9qgsFz0xllLzyYpNe5gjedHtPHaQQu4VJmTtFoneTq9-UkiDLBjPgx7qmvO76t8jpJuanA%3D%3D?uid=174169485&filename=solid_storage.json&disposition=attachment&hash=&limit=0&content_type=text%2Fplain&owner_uid=174169485&fsize=91&hid=c8adafc8c7c5e70da81e1635eefc4b49&media_type=text&tknv=v2&etag=32f7432eca8fbc3fb73393acb9e51764
// https://downloader.disk.yandex.ru/disk/b6757401ce2f3751b593cc520b990e1e2eb96044a3856db36aaec5879efb9a7a/5ff451dd/n8cCt5K--tPekjAr9qgsFz0xllLzyYpNe5gjedHtPHaQQu4VJmTtFoneTq9-UkiDLBjPgx7qmvO76t8jpJuanA%3D%3D?uid=174169485&filename=solid_storage.json&disposition=attachment&hash=&limit=0&content_type=text%2Fplain&owner_uid=174169485&fsize=91&hid=c8adafc8c7c5e70da81e1635eefc4b49&media_type=text&tknv=v2&etag=32f7432eca8fbc3fb73393acb9e51764
