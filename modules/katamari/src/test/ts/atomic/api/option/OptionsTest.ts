import * as Arr from 'ephox/katamari/api/Arr';
import * as Fun from 'ephox/katamari/api/Fun';
import { Option } from 'ephox/katamari/api/Option';
import * as Options from 'ephox/katamari/api/Options';
import * as ArbDataTypes from 'ephox/katamari/test/arb/ArbDataTypes';
import fc from 'fast-check';
import { UnitTest, Assert } from '@ephox/bedrock-client';

UnitTest.test('OptionsTest', function () {
  const person = function (name, age, address) {
    return { name, age, address };
  };

  const arr1 = [Option.some(1), Option.none(), Option.some(2), Option.some(3), Option.none(), Option.none(), Option.none(), Option.none(), Option.some(4)];
  Assert.eq('eq', [1, 2, 3, 4], Options.cat(arr1));

  Assert.eq('each returns undefined 1', undefined, Option.some(1).each(Fun.identity));
  Assert.eq('each returns undefined 2', undefined, Option.none().each(Fun.identity));
});

UnitTest.test('Options.cat of only nones should be an empty array', () => {
  fc.assert(fc.property(
    fc.array(ArbDataTypes.optionNone()),
    function (options) {
      const output = Options.cat(options);
      Assert.eq('eq',  0, output.length);
    }
  ));
});

UnitTest.test('Options.cat of only somes should have the same length', () => {
  fc.assert(fc.property(
    fc.array(ArbDataTypes.optionSome(fc.integer())),
    function (options) {
      const output = Options.cat(options);
      Assert.eq('eq',  options.length, output.length);
    }
  ));
});

UnitTest.test('Options.cat of Arr.map(xs, Option.some) should be xs', () => {
  fc.assert(fc.property(
    fc.array(fc.json()),
    function (arr) {
      const options = Arr.map(arr, Option.some);
      const output = Options.cat(options);
      Assert.eq('eq',  arr, output);
    }
  ));
});

UnitTest.test('Options.cat of somes and nones should have length <= original', () => {
  fc.assert(fc.property(
    fc.array(ArbDataTypes.option(fc.integer())),
    function (arr) {
      const output = Options.cat(arr);
      Assert.eq('eq',  output.length <= arr.length, true);
    }
  ));
});

UnitTest.test('Options.cat of nones.concat(somes).concat(nones) should be somes', () => {
  fc.assert(fc.property(
    fc.array(fc.json()),
    fc.array(fc.json()),
    fc.array(fc.json()),
    function (before, on, after) {
      const beforeNones = Arr.map(before, Option.none);
      const afterNones = Arr.map(after, Option.none);
      const onSomes = Arr.map(on, Option.some);
      const output = Options.cat(beforeNones.concat(onSomes).concat(afterNones));
      Assert.eq('eq',  on, output);
    }
  ));
});

UnitTest.test('Options.findMap of empty is none', () => {
  fc.assert(fc.property(
    fc.func(ArbDataTypes.option(fc.integer())),
    function (f) {
      Assert.eq('eq',  true, Options.findMap([ ], f).isNone());
    }
  ));
});

UnitTest.test('Options.findMap of non-empty is first if f is Option.some', () => {
  fc.assert(fc.property(
    fc.array(fc.json(), 1, 40),
    function (arr) {
      Assert.eq('eq',  arr[0], Options.findMap(arr, Option.some).getOrDie());
    }
  ));
});

UnitTest.test('Options.findMap of non-empty is none if f is Option.none', () => {
  fc.assert(fc.property(
    fc.array(fc.json(), 1, 40),
    function (arr) {
      Assert.eq('eq',  true, Options.findMap(arr, Option.none).isNone());
    }
  ));
});