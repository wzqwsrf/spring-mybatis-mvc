package com.wzq.security.service;

import com.wzq.security.dao.UserDaoMapper;
import com.wzq.security.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @Author:wangzhenqing
 * @Date:
 * @Description:
 */

@Component
public class UserServiceImpl implements UserService{

    @Autowired(required = true)
    private UserDaoMapper userDaoMapper;

    @Override
    public User getById(int id) {
        return userDaoMapper.getUserById(id);
    }

    @Override
    public void setAdminById(int id, String admin) {
        userDaoMapper.setAdminById(id, admin);
    }

    @Override
    public void delUserById(int id) {
        userDaoMapper.delUserById(id);
    }

    @Override
    public List<User> getAllUserList() {
        return userDaoMapper.getAllUsers();
    }

}
