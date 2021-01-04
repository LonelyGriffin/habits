import React, {useCallback} from 'react'
import Button from '@material-ui/core/Button'
import {useService} from '../../dependencyInjection/hooks'
import {RootDIType} from '../../dependencyInjection/rootType'
import {Yadisk} from '../../service/yadisk'

export const YadiskHeaderControl = () => {
  const yadisk = useService<Yadisk>(RootDIType.Yadisk)
  const redirectToAuth = () => {
    window.location.href =
      'https://oauth.yandex.ru/authorize?response_type=token&' +
      'client_id=23cb967d4f47442c8ba11343de9ab679&' +
      'redirect_uri=https://beta.habits.lonelygriffin.com?route=/oauth/yandex'
  }
  const authClickHandler = useCallback(() => {
    if (yadisk.hasToken()) {
      return
    }
    redirectToAuth()
  }, [])

  const syncClickHandler = useCallback(async () => {
    const syncResult = await yadisk.sync()
    if (syncResult.isFailed) {
      alert('Для синхронизации нужно авторизоваться на яндексе')
      redirectToAuth()
    }
  }, [])
  return (
    <>
      {/*<Button color="inherit" onClick={authClickHandler}>Auth</Button>*/}
      <Button color='inherit' onClick={syncClickHandler}>
        Sync
      </Button>
    </>
  )
}
