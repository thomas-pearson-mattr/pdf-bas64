import React, {Dispatch, SetStateAction} from 'react';
import {Button, Text, StyleSheet} from 'react-native';
import {Durations} from './store';

const DurationView = (props: {duration: Durations}) => {
  const {duration} = props;

  const [writeMs, deleteMs, totalMs] = [
    duration.writeMs,
    duration.deleteMs,
    duration.totalMs,
  ].map(dur => `${dur.toFixed(2)}ms`);

  return (
    <>
      <Text style={style.text}>Write: {writeMs}</Text>
      <Text style={style.text}>Delete: {deleteMs}</Text>
      <Text style={style.text}>Total: {totalMs}</Text>
    </>
  );
};

const AvgView = (props: {durations: Durations[]}) => {
  const {durations} = props;

  const totals = durations.reduce(
    (cur, next) => ({
      writeMs: cur.writeMs + next.writeMs,
      deleteMs: cur.deleteMs + next.deleteMs,
      totalMs: cur.totalMs + next.totalMs,
    }),
    {
      writeMs: 0,
      deleteMs: 0,
      totalMs: 0,
    },
  );

  const [writeMs, deleteMs, totalMs] = [
    totals.writeMs,
    totals.deleteMs,
    totals.totalMs,
  ].map(dur => (durations.length ? dur / durations.length : 0));

  return <DurationView duration={{writeMs, deleteMs, totalMs}} />;
};

export const StatView = (props: {
  durations: Durations[];
  setDurations: Dispatch<SetStateAction<Durations[]>>;
}) => {
  const {durations, setDurations} = props;

  if (durations.length <= 0) {
    return;
  }

  const last = durations[durations.length - 1];

  return (
    <>
      <Text style={style.header}>Raw Performance</Text>
      <DurationView duration={last} />

      <Text style={style.header}>Raw Performance Avg's</Text>
      <AvgView durations={durations} />
      <Button
        onPress={() => setDurations([])}
        title="Reset Durations"
        color="#841584"
      />
    </>
  );
};

const style = StyleSheet.create({
  header: {
    textAlign: 'center',
    fontSize: 25,
    paddingTop: 10,
    paddingBottom: 10,
    fontWeight: 'bold',
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
  },
});
