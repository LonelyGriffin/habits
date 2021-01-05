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

      if (!downloadResponse?.data?.href) {
        return new AppResultError('Sync failed')
      }

      const response = await axios.get(downloadResponse?.data?.href, {
        headers: {
          origin: null
        }
      })

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
