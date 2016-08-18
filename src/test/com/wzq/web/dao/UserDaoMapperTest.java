package com.wzq.web.dao;

import com.wzq.web.model.User;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

/**
 * Author: zhenqing.wang <wangzhenqing1008@163.com>
 * Date: 2016-08-17 12:09:54
 * Description: 测试
 */
@RunWith(SpringJUnit4ClassRunner.class)
@Transactional
@ContextConfiguration(locations = {"classpath:/spring.xml"})
public class UserDaoMapperTest {
    @Autowired
    private UserDaoMapper userDaoMapper;

    @Test
    public void testGetUserById(){
        Integer id = 1;
        User user = userDaoMapper.getUserById(id);
        System.out.println(user.getAdmin());
    }

    @Test
    public void addUser(){
        User user = new User("zhenqing","aaa");
        userDaoMapper.addUser(user);

    }


}
