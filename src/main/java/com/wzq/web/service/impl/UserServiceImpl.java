package com.wzq.web.service.impl;

import com.wzq.web.dao.UserDaoMapper;
import com.wzq.web.model.User;
import com.wzq.web.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @Author:wangzhenqing
 * @Date:
 * @Description:
 */

@Service
public class UserServiceImpl implements UserService {

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
