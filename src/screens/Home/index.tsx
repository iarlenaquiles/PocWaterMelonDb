import React, { useRef, useState, useEffect } from 'react';
import { FlatList, Alert } from 'react-native';

import { Menu, MenuTypeProps } from '../../components/Menu';
import { Skill } from '../../components/Skill';
import { Button } from '../../components/Button';

import { Container, Title, Input, Form, FormTitle } from './styles';

import { database } from '../../databases';
import { SkillModel } from '../../databases/model/skillModel';
import { Q } from '@nozbe/watermelondb';

export function Home() {
  const [type, setType] = useState<MenuTypeProps>("soft");
  const [name, setName] = useState('');
  const [skills, setSkills] = useState<SkillModel[]>([]);
  const [skill, setSkill] = useState<SkillModel>({} as SkillModel);


  async function handleSave() {
    if (skill.id) {
      await database.write(async () => {
        await skill.update(data => {
          data.name = name,
            data.type = type
        });
      });

      Alert.alert("Updated!");
      setSkill({} as SkillModel);
    } else {
      await database.write(async () => {
        await database
          .get<SkillModel>('skills')
          .create(data => {
            data.name = name,
              data.type = type
          });
      });
      Alert.alert("Created!");
    }

    fetchData();
  }

  async function handleRemove(item: SkillModel) {
    await database.write(async () => {
      await item.destroyPermanently();
    });

    fetchData();
    Alert.alert("Deleted!");
  }

  async function fetchData() {
    const skillCollection = database.get<SkillModel>('skills');
    const response = await skillCollection
      .query(
        Q.where('type', type)
      )
      .fetch();

    setSkills(response);
  }

  async function handleEdit(item: SkillModel) {
    setSkill(item);
    setName(item.name);
  }

  useEffect(() => {
    fetchData();
  }, [type]);

  return (
    <Container>
      <Title>About me</Title>
      <Menu
        type={type}
        setType={setType}
      />

      <FlatList
        data={skills}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Skill
            data={item}
            onEdit={() => handleEdit(item)}
            onRemove={() => handleRemove(item)}
          />
        )}
      />

 
        <Form>
          <FormTitle>
            Skill
          </FormTitle>

          <Input
            placeholder="New skill..."
            onChangeText={setName}
            value={name}
          />

          <Button
            title="Save"
            onPress={handleSave}
          />
        </Form>
    
    </Container>
  );
}