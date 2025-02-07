/**
 * Copyright (c) OpenSpug Organization. https://github.com/openspug/spug
 * Copyright (c) <spug.dev@gmail.com>
 * Released under the AGPL-3.0 License.
 */
import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {Form, Input, Button, Spin, message} from 'antd';
import {Link} from 'components';
import css from './index.module.css';
import {http, clsNames} from 'libs';
import store from './store';

export default observer(function () {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [balance, setBalance] = useState({})

  useEffect(() => {
    if (store.settings.spug_push_key) {
      fetchBalance()
    }
  }, []);

  function fetchBalance() {
    setFetching(true)
    http.get('/api/setting/balance/')
      .then(res => setBalance(res))
      .finally(() => {
        setLoading(false)
        setFetching(false)
      })
  }

  function handleBind() {
    const spug_push_key = store.settings.spug_push_key
    if (!spug_push_key) return message.error('请输入要绑定的推送助手用户ID')
    setLoading(true);
    http.post('/api/setting/', {data: [{key: 'spug_push_key', value: spug_push_key}]})
      .then(() => {
        message.success('保存成功');
        store.fetchSettings();
        fetchBalance()
      })
      .finally(() => store.loading = false)
  }

  const isVip = true
  return (
    <React.Fragment>
      <div className={css.title}>推送服务设置</div>
      <div style={{maxWidth: 340}}>
        <Form.Item label="推送助手账户绑定" labelCol={{span: 24}} style={{marginTop: 12}}
                   extra={<div>请登录 <Link href="https://push.spug.cc/login" title="推送助手"/>，至个人中心 /
                     个人设置查看用户ID，注意保密该ID请勿泄漏给第三方。</div>}>

          <Input.Group compact>
            <Input
              value={store.settings.spug_push_key}
              onChange={e => store.settings.spug_push_key = e.target.value}
              style={{width: 'calc(100% - 100px)'}}
              placeholder="请输入要绑定的推送助手用户ID"/>
            <Button
              type="primary"
              style={{width: 80, marginLeft: 20}}
              onClick={handleBind}
              loading={loading}>确定</Button>
          </Input.Group>
          {/*<Input.Group compact>*/}
          {/*  <Input bordered={false} style={{width: 'calc(100% - 100px)', paddingLeft: 0}} value="32uu73******64823d"/>*/}
          {/*  <Button style={{width: 80, marginLeft: 20}}>解绑</Button>*/}
          {/*</Input.Group>*/}
        </Form.Item>
      </div>

      <Form.Item style={{marginTop: 24}}
                 extra={<div> 如需充值请至 <Link href="https://push.spug.cc/buy/sms" title="推送助手"/>，具体计费规则及说明请查看推送助手官网。
                 </div>}>
        <div className={css.statistic}>
          <Spin spinning={fetching}>
            <div className={css.body}>
              <div className={css.item}>
                <div className={css.title}>短信余额</div>
                <div className={css.value}>{balance.sms_balance}</div>
              </div>
              <div className={css.item}>
                <div className={css.title}>语音余额</div>
                <div className={css.value}>{balance.voice_balance}</div>
              </div>
              <div className={css.item}>
                <div className={css.title}>邮件余额</div>
                <div className={css.value}>{balance.mail_balance}</div>
                {isVip ? (
                  <div className={clsNames(css.tips, css.active)}>+ 会员免费20封 / 天</div>
                ) : (
                  <div className={css.tips}>会员免费20封 / 天</div>
                )}
              </div>
              <div className={css.item}>
                <div className={css.title}>微信公众号余额</div>
                <div className={css.value}>{balance.wx_mp_balance}</div>
                {isVip ? (
                  <div className={clsNames(css.tips, css.active)}>+ 会员免费100条 / 天</div>
                ) : (
                  <div className={css.tips}>会员免费20封 / 天</div>
                )}
              </div>
            </div>
          </Spin>
        </div>
      </Form.Item>
    </React.Fragment>
  )
})