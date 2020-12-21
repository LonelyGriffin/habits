import React, {useCallback, useState} from 'react'
import moment, {Moment} from 'moment'
import {PageHeader, DatePicker, Input, Divider} from 'antd'
import * as styles from './Diary.module.less'

const {TextArea} = Input

export function DiaryScreenView() {
  const [selectedDate, setSelectedDate] = useState<Moment>(moment())
  const disabledFeatureDate = useCallback((current: Moment) => current && current > moment().endOf('day'), [])

  const handleDatePickerChange = useCallback((date: Moment | null) => {
    if (date !== null) {
      setSelectedDate(date)
    }
  }, [])

  const diaryNote = ''

  return (
    <div className={styles.root}>
      <PageHeader className={styles.header} title={'Дневник'} />

      <DatePicker
        className={styles.calendar}
        size={'large'}
        disabledDate={disabledFeatureDate}
        defaultValue={selectedDate}
        onChange={handleDatePickerChange}
      />
      <Divider>Как прошел день?</Divider>
      <TextArea className={styles.textarea} rows={8} />
    </div>
  )
}
