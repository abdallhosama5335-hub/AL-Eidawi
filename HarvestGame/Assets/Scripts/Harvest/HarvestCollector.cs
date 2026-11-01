using UnityEngine;

public class HarvestCollector : MonoBehaviour
{
    public HarvestConfig config;

    public int Score { get; private set; }
    public int Load { get; private set; }

    public void OnGrassCut(int points)
    {
        if (Load >= config.maxCapacity) return;   // الحاوية ممتلئة
        Load++;
        Score += points;
    }

    // عند الوصول لمنطقة التفريغ (Collider بتاغ "Dropoff" و IsTrigger مفعّل)
    void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Dropoff") && Load > 0)
        {
            Debug.Log($"تم تفريغ {Load} حزمة");
            Load = 0;
        }
    }
}
