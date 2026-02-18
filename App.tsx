import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import {
  createInventoryItem,
  listInventory,
  removeInventoryItem,
  updateInventoryItem
} from './src/services/inventoryService';
import { InventoryItem, NewInventoryItem } from './src/types';

const emptyForm: NewInventoryItem = {
  name: '',
  sku: '',
  quantity: 0,
  price: 0
};

export default function App() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<NewInventoryItem>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const totalValue = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.price, 0),
    [items]
  );

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listInventory();
      setItems(data);
    } catch (loadError) {
      setError('Could not load inventory. Verify your Firebase config and Firestore rules.');
      console.error(loadError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const submitForm = async () => {
    if (!form.name.trim() || !form.sku.trim()) {
      Alert.alert('Missing fields', 'Name and SKU are required.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      if (editingId) {
        await updateInventoryItem(editingId, form);
      } else {
        await createInventoryItem(form);
      }

      resetForm();
      await loadItems();
    } catch (submitError) {
      setError('Could not save item. Please retry.');
      console.error(submitError);
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      sku: item.sku,
      quantity: item.quantity,
      price: item.price
    });
  };

  const onDelete = (item: InventoryItem) => {
    Alert.alert('Delete item?', `Remove ${item.name} from inventory?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeInventoryItem(item.id);
            await loadItems();
          } catch (deleteError) {
            setError('Could not delete the item.');
            console.error(deleteError);
          }
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.title}>Inventory POS</Text>
      <Text style={styles.subtitle}>Track stock, SKU, and pricing in Firestore</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{editingId ? 'Edit item' : 'Add item'}</Text>
        <TextInput
          placeholder="Product name"
          value={form.name}
          onChangeText={(value) => setForm((prev) => ({ ...prev, name: value }))}
          style={styles.input}
        />
        <TextInput
          placeholder="SKU"
          value={form.sku}
          onChangeText={(value) => setForm((prev) => ({ ...prev, sku: value }))}
          autoCapitalize="characters"
          style={styles.input}
        />
        <View style={styles.row}>
          <TextInput
            placeholder="Quantity"
            value={String(form.quantity)}
            onChangeText={(value) =>
              setForm((prev) => ({ ...prev, quantity: Number.parseInt(value || '0', 10) || 0 }))
            }
            keyboardType="number-pad"
            style={[styles.input, styles.halfInput]}
          />
          <TextInput
            placeholder="Price"
            value={String(form.price)}
            onChangeText={(value) =>
              setForm((prev) => ({ ...prev, price: Number.parseFloat(value || '0') || 0 }))
            }
            keyboardType="decimal-pad"
            style={[styles.input, styles.halfInput]}
          />
        </View>

        <View style={styles.row}>
          <Pressable
            onPress={submitForm}
            style={[styles.button, submitting ? styles.buttonDisabled : null]}
            disabled={submitting}
          >
            <Text style={styles.buttonText}>{editingId ? 'Update' : 'Add'}</Text>
          </Pressable>
          <Pressable onPress={resetForm} style={[styles.button, styles.buttonSecondary]}>
            <Text style={styles.buttonText}>Clear</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Inventory ({items.length})</Text>
        <Text style={styles.totalValue}>Total stock value: ${totalValue.toFixed(2)}</Text>

        {loading ? (
          <Text style={styles.helper}>Loading inventory...</Text>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<Text style={styles.helper}>No items yet.</Text>}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <View>
                  <Text style={styles.product}>{item.name}</Text>
                  <Text style={styles.meta}>SKU: {item.sku}</Text>
                  <Text style={styles.meta}>
                    Qty: {item.quantity} • ${item.price.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.actions}>
                  <Pressable onPress={() => onEdit(item)} style={styles.textButton}>
                    <Text style={styles.actionText}>Edit</Text>
                  </Pressable>
                  <Pressable onPress={() => onDelete(item)} style={styles.textButton}>
                    <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fb',
    padding: 16,
    gap: 12
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#12203a'
  },
  subtitle: {
    fontSize: 14,
    color: '#475569'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#0f172a'
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    backgroundColor: '#fff'
  },
  row: {
    flexDirection: 'row',
    gap: 8
  },
  halfInput: {
    flex: 1
  },
  button: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: '#2563eb',
    paddingVertical: 11,
    alignItems: 'center'
  },
  buttonSecondary: {
    backgroundColor: '#0f172a'
  },
  buttonDisabled: {
    opacity: 0.7
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600'
  },
  list: {
    paddingBottom: 8,
    gap: 8
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center'
  },
  product: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b'
  },
  meta: {
    fontSize: 13,
    color: '#475569'
  },
  actions: {
    flexDirection: 'row',
    gap: 8
  },
  textButton: {
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb'
  },
  deleteText: {
    color: '#dc2626'
  },
  helper: {
    color: '#64748b',
    fontStyle: 'italic'
  },
  error: {
    color: '#b91c1c',
    fontWeight: '500'
  },
  totalValue: {
    marginBottom: 8,
    color: '#334155'
  }
});
